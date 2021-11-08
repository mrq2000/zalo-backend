const Joi = require('joi');

const messagesService = require('../../services/messages');
const { abort } = require('../../../helpers/error');

async function validation(friendInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      limit: Joi.number().integer().min(0).required(),
      friendId: Joi.number().integer().min(1).required(),
      cursor: Joi.number().integer().allow(null),
    });

    return await Joi.validate(friendInfo, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}

async function getFriendMessages(req, res) {
  const friendInfo = {
    userId: req.user.id,
    friendId: Number(req.params.friendId),
    cursor: req.query.cursor,
    limit: Number(req.query.limit),
  };

  await validation(friendInfo);

  const responseData = await messagesService.getFriendMessages(friendInfo);
  return res.status(200).send(responseData);
}

module.exports = getFriendMessages;
