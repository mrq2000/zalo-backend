const express = require('express');
const { notifications: notificationController } = require('../http/controllers');
const { auth } = require('../http/middlewares');

const router = express.Router();

router.get('/notifications', auth, notificationController.getAllNoti);

module.exports = router;
