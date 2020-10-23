const Joi = require("@hapi/joi");
const HttpStatus = require("http-status-codes");
const User = require("../models/userModel");
const Helpers = require('../Helper/helpers');
const dbConfig = require('../config/secret');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const capitalizeAllWords = require("capitalizefirstletterofwords");

module.exports = {
  async CreateUser(req, res) {
    console.log(req.body);
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),

      username: Joi.string().alphanum().min(3).max(30).required(),

      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),

      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });
    const { error, value } = schema.validate(req.body);
    // const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ msg: error.details });
    }

    //checking if username or email already exist in database
    const userEmail = await User.findOne({ email: Helpers.lowerCase(req.body.email ) });
    if(userEmail){
        return res.status(HttpStatus.CONFLICT).json({ message: 'Email already exist '})
    }

    const userName = await User.findOne( {username: Helpers.firstUpper(req.body.username)} );
    if(userName){
        return res.status(HttpStatus.CONFLICT).json({ message: 'Username already exist '})
    }

    //hashing password before saving in database
    return bcrypt.hash(value.password, 10, function(err, hash) {
        if(err) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Error hasing password'})
        }
        const body = {
            name: capitalizeAllWords(value.name),
            username: Helpers.firstUpper(value.username),
            email: Helpers.lowerCase(value.email),
            password: hash
        };
        //save to database
        User.create(body).then(user => {
            const token = jwt.sign({data: user}, dbConfig.secret, {
                expiresIn: '5h'
            });
            res.cookie('auth', token);

            res.status(HttpStatus.CREATED).json({ message: "User created Successfully", user, token});
        }).catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error occured"})
        })
    });
  },

  async LoginUser(req, res) {
    if (!req.body.username || !req.body.password) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'No empty fields allowed' });
    }

    //finding username from db
    await User.findOne({ username: Helpers.firstUpper(req.body.username) })
      .then(user => {
        if (!user) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Username not found' });
        }
 
        //checking password
        return bcrypt.compare(req.body.password, user.password).then(result => {
          if (!result) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: 'Password is incorrect' });
          }
          //creating token
          const token = jwt.sign({ data: user }, dbConfig.secret, {
            expiresIn: '5h'
          });
          //set the cookie
          res.cookie('auth', token);
          return res
            .status(HttpStatus.OK)
            .json({ message: 'Login successful', user, token });
        });
      })
      .catch(err => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  }
};
