const Joi = require('joi');

const userService = require('../../services/user');
const { abort } = require('../../../helpers/error');

async function validation(userInfo) {
  try {
    const schema = Joi.object().keys({
      myId: Joi.number().integer().min(1).required(),
      userId: Joi.number().integer().min(1).required(),
      offset: Joi.number().integer().required(),
      limit: Joi.number().integer().required(),
    });

    return await Joi.validate(userInfo, schema);
  } catch (error) {
    return abort(400, 'Params error');
  }
}
async function getUserPosts(req, res) {
  const userInfo = {
    userId: Number(req.params.userId),
    offset: req.query.offset,
    limit: req.query.limit,
    myId: req.user.id,
  };

  await validation(userInfo);

  const responseData = await userService.getUserPosts(userInfo);

  return res.status(200).send(responseData);
}

module.exports = getUserPosts;
