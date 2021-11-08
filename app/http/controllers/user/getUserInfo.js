const Joi = require('joi');

const userService = require('../../services/user');
const { abort } = require('../../../helpers/error');

async function validation(userInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
    });

    return await Joi.validate(userInfo, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}
async function getUserInfo(req, res) {
  const userId = Number(req.params.userId);
  await validation({ userId });

  const responseData = await userService.getUserInfo(userId);

  return res.status(200).send(responseData);
}

module.exports = getUserInfo;
