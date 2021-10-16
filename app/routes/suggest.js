const express = require('express');
const { suggest: suggestController } = require('../http/controllers');
const { auth } = require('../http/middlewares');

const router = express.Router();

router.get('/suggest/my-friends', auth, suggestController.suggestMyFriend);
router.get('/suggest/users', auth, suggestController.suggestUser);

module.exports = router;
