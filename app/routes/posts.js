const express = require('express');
const { posts: postsController } = require('../http/controllers');
const { auth, uploadImage } = require('../http/middlewares');

const router = express.Router();

router.post('/posts', auth, uploadImage().array('image'), postsController.addPost);
router.get('/my-posts', auth, postsController.getMyPosts);
router.get('/posts/:postId', auth, postsController.getPostInfo);
router.get('/posts', auth, postsController.getPostList);
router.post('/posts/:postId/like', auth, postsController.likePost);
router.delete('/posts', auth, postsController.deletePost);
router.post('/posts/comment', auth, postsController.commentPost);

module.exports = router;
