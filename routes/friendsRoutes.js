const express = require('express');

const router = express.Router();

const FriendCtrl = require('../controllers/friends.js');
const AuthHelper = require('../Helper/AuthHelper');

router.post('/follow-user', AuthHelper.VerifyToken, FriendCtrl.FollowUser);

module.exports = router;
