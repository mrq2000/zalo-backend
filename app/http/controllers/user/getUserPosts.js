const Joi = require('joi');

const userService = require('../../services/user');
const { abort } = require('../../../helpers/error');

async function validation(userInfo) {
  try {
    const schema = Joi.object().keys({
      myId: Joi.number().integer().min(1).required(),
      userId: Joi.number().integer().min(1).required(),
      last_id: Joi.number().integer().allow(''),
      count: Joi.number().integer().required(),
    });

    return await Joi.validate(userInfo, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}
async function getUserPosts(req, res) {
  const userInfo = {
    userId: Number(req.params.userId),
    last_id: req.query.last_id,
    count: req.query.count,
    myId: req.user.id,
  };

  await validation(userInfo);

  const responseData = await userService.getUserPosts(userInfo);

  return res.status(200).send(responseData);
}

module.exports = getUserPosts;
