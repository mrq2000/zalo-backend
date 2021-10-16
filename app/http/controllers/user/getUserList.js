const Joi = require('joi');

const userService = require('../../services/user');
const { abort } = require('../../../helpers/error');

async function validation(userInfo) {
  try {
    const schema = Joi.object().keys({
      userIds: Joi.array().items(Joi.number().integer().min(1).required()).required(),
    });

    return await Joi.validate(userInfo, schema);
  } catch (error) {
    return abort(400, 'Params error');
  }
}
async function getUserList(req, res) {
  const userIds = JSON.parse(req.query.userIds);
  await validation({ userIds });

  const responseData = await userService.getUserList(userIds);

  return res.status(200).send(responseData);
}

module.exports = getUserList;
