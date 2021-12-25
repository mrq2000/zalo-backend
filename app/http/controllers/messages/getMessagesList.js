const Joi = require('joi');

const messagesService = require('../../services/messages');
const { abort } = require('../../../helpers/error');

async function validation(friendInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      limit: Joi.number().integer().min(0).required(),
      offset: Joi.number().integer().min(0).required(),
    });

    return await Joi.validate(friendInfo, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}

async function getMessagesList(req, res) {
  const friendInfo = {
    userId: req.user.id,
    offset: req.query.offset,
    limit: req.query.limit,
  };

  const formatParams = await validation(friendInfo);
  const responseData = await messagesService.getMessagesList(formatParams);
  return res.status(200).send(responseData);
}

module.exports = getMessagesList;
