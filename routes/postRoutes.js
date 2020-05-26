const express = require('express')
const router = express.Router();

const PostCtrl = require('../controllers/post');
const AuthHelper = require('../Helper/AuthHelper')

router.get('/posts', AuthHelper.VerifyToken, PostCtrl.GetAllPosts)
router.post('/post/add-post', AuthHelper.VerifyToken, PostCtrl.AddPost);
router.post('/post/add-like', AuthHelper.VerifyToken, PostCtrl.AddLike);

module.exports = router;
