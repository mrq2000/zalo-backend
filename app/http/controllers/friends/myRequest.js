const Joi = require('joi');

const friendsService = require('../../services/friends');
const { abort } = require('../../../helpers/error');

async function validation(userInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
    });

    return await Joi.validate(userInfo, schema);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function myRequest(req, res) {
  const userInfo = {
    userId: req.user.id,
  };

  await validation(userInfo);

  const response = await friendsService.myRequest(userInfo);
  return res.status(200).send(response);
}

module.exports = myRequest;
