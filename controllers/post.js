
const Joi = require('joi');
const HttpStatus = require('http-status-codes');

const Post = require('../models/postModels');

module.exports = {
  AddPost(req,res) {
    console.log(req.body);
    console.log(req.cookies);
    console.log(req.user);
    
    
    
    // const schema = Joi.object().keys({
    //   post: Joi.string().required()
    // });
    // const {error} = Joi.validate(req.body, schema);
    // if(error && error.details) {
    //   return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details})
    // }
    // const body = {
    //   user: req.user._id,
    //   username: req.user.username,
    //   post: req.body.post,
    //   created: new Date()
    // };

    // Post.create(body)
    //   then(post => {
    //     res.status(HttpStatus.OK).json({ message: 'Post Created', post})
    //   })
    //   .catch(err => {
    //     res.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //     .json({ message: 'Error Occured'})
    //   })
  }
}
