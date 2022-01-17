const Joi = require('joi');

const userService = require('../../services/user');
const { abort } = require('../../../helpers/error');

async function validation(userInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      myId: Joi.number().integer().min(1).required(),
    });

    return await Joi.validate(userInfo, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}
async function getUserPage(req, res) {
  const params = {
    userId: Number(req.params.userId),
    myId: Number(req.user.id),
  };

  await validation(params);

  const responseData = await userService.getUserInformation(params);

  return res.status(200).send({ ...responseData });
}

module.exports = getUserPage;
