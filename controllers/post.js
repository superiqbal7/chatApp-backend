
const Joi = require('joi');
const HttpStatus = require('http-status-codes');

const Post = require('../models/postModels');
const User = require('../models/userModel');

module.exports = {     

  AddPost(req, res) {
    // console.log(req.body);
    // console.log(req.cookies);
    // console.log(req.user);

    //creating schema for req to validate post data
    const schema = Joi.object().keys({
      post: Joi.string().required()
    });
    const body = {
      post: req.body.post
    };
    const { error } = Joi.validate(body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }
    //importing data from req and saving in body to save in db
    const bodyObj = {
      user: req.user._id,
      username: req.user.username,
      post: req.body.post,
      created: new Date()
    };

    //creating post in db 
    Post.create(bodyObj)
      .then(async post => {
        //updating post in user array 
        await User.update(
          //getting the userid from req and save post in user array
          {
            _id: req.user._id
          },
          {
            $push: {
              posts: {
                postId: post._id,
                post: req.body.post,
                created: new Date()
              }
            }
          }
        );
        res.status(HttpStatus.OK).json({ message: 'Post created', post });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },

  async GetAllPosts(req, res) {
    try {
      const posts = await Post.find({})
        .populate('User')
        .sort({ created: -1 });
      const top = await Post.find({totalLikes: {$gte: 2}})
        .populate('User')
        .sort({ created: -1 });

      return res.status(HttpStatus.OK).json({ message: 'All posts', posts, top });
    }
    catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error occured', err });
    }
  },

  async AddLike(req, res) {
    const postId = req.body._id;
    await Post.update(
      {
        _id: postId,
        'likes.username': { 
          $ne: req.user.username 
        }
      },
      {
        $push: {
          likes: {
            username: req.user.username
          }
        },
        $inc: { totalLikes: 1 }
      }
    )
      .then(() => {
        res.status(HttpStatus.OK).json({
          message: 'You liked the post'
        });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error Occured" });
      })
  },

  async AddComment(req, res) {
    console.log(req.body);
    
    const postId = req.body.postId;
    await Post.update(
      {
        _id: postId
      },
      {
        $push: {
          comments: {
            userId: req.user._id,
            username: req.user.username,
            comment: req.body.comment,
            createdAt: new Date()
          }
        }
      }
    )
      .then(() => {
        res.status(HttpStatus.OK).json({
          message: 'You commented in the post'
        });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error Occured" });
      })
  },

  async GetPost(req, res) {
    console.log(req.params.id);
    
    await Post.findOne({ _id: req.params.id })
      .populate('User')
      .populate('comments.User')
      .then(post => {
        res.status(HttpStatus.OK).json({ message: 'Post found', post });
      })
      .catch(err =>
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Post not found', err })
      );
  }
}
