const Joi = require('joi');

const authService = require('../../services/auth');
const { abort } = require('../../../helpers/error');

async function validation(userInfo) {
  try {
    const schema = Joi.object().keys({
      phonenumber: Joi.string().min(8).required(),
      password: Joi.string().min(6).required(),
      uuid: Joi.string().required(),
    });

    return await Joi.validate(userInfo, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}

async function signUp(req, res) {
  const userInfo = {
    phonenumber: req.body.phonenumber,
    password: req.body.password,
    uuid: req.body.uuid,
  };
  await validation(userInfo);

  const data = await authService.signUp(userInfo);
  return res.status(200).send({
    code: 1000,
    data,
  });
}

module.exports = signUp;
