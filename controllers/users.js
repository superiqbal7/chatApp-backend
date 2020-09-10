const httpStatus = require('http-status-codes');

const User = require('../models/userModel');


module.exports = {
  async GetAllUsers(req,res){
    await User.find({})
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .then((result) => {
        res.status(httpStatus.OK).json({ message: 'All users', result});
      }).catch(err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error found in getting all user'});
      })
  },

  async GetUsers(req, res) {
    await User.findOne({_id: req.params.id})
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .then((result) => {
        res.status(httpStatus.OK).json({ message: 'User by ID', result });
      }).catch(err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error found in getting user' });
      })
  },

  async GetUserByUserName(req, res) {
    await User.findOne({ _id: req.params.username })
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .then((result) => {
        res.status(httpStatus.OK).json({ message: 'User by Username', result });
      }).catch(err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error found in getting user' });
      })
  }
}    
