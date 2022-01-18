const express = require('express');
const { user: userController } = require('../http/controllers');
const { auth, uploadImage } = require('../http/middlewares');

const router = express.Router();

router.get('/my-page', auth, userController.getMyPage);
router.post('/me/update-avatar', auth, uploadImage().single('mainAvatar'),
  userController.updateAvatar);

router.post('/me/update-fullname', auth, userController.updateFullName);

router.get('/users/:userId/info', auth, userController.getUserPage);
router.get('/users/:userId/posts', auth, userController.getUserPosts);

router.get('/users/info/phonenumber', userController.getUserInfoByPhoneNumber);
router.get('/users/info/:userId', auth, userController.getUserInfo);
router.get('/users/list', auth, userController.getUserList);

module.exports = router;
