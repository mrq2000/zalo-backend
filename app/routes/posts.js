const express = require('express');
const { posts: postsController } = require('../http/controllers');
const { auth } = require('../http/middlewares');

const router = express.Router();

router.post('/posts', auth, postsController.addPost);
router.get('/my-posts', auth, postsController.getMyPosts);
router.post('/posts/:postId/like', auth, postsController.likePost);

module.exports = router;
