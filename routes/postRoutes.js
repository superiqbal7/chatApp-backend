const express = require('express')
const router = express.Router();

const PostCtrl = require('../controllers/post');
const AuthHelper = require('../Helper/AuthHelper')

router.post('/post/add-post', AuthHelper.VerifyToken, PostCtrl.AddPost);

module.exports = router;
