const express = require('express');

const router = express.Router();

const FriendCtrl = require('../controllers/friends.js');
const AuthHelper = require('../Helper/AuthHelper');

router.post('/follow-user', AuthHelper.VerifyToken, FriendCtrl.FollowUser);

router.post('/unfollow-user', AuthHelper.VerifyToken, FriendCtrl.UnFollowUser);

router.post('/mark/:id', AuthHelper.VerifyToken, FriendCtrl.MarkNotification);

module.exports = router;
