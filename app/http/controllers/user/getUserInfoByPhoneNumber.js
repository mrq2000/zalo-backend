const Joi = require('joi');

const userService = require('../../services/user');
const { abort } = require('../../../helpers/error');

async function validation(userInfo) {
  try {
    const schema = Joi.object().keys({
      phonenumber: Joi.string().required(),
    });

    return await Joi.validate(userInfo, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}
async function getUserInfoByPhoneNumber(req, res) {
  const { phonenumber } = req.query;
  await validation({ phonenumber });
  const responseData = await userService.getUserInfoByPhoneNumber(phonenumber);

  return res.status(200).send(responseData);
}

module.exports = getUserInfoByPhoneNumber;
