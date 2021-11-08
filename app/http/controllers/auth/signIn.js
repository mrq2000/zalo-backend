const Joi = require('joi');

const authService = require('../../services/auth');
const { abort } = require('../../../helpers/error');

async function validation(credentials) {
  try {
    const schema = Joi.object().keys({
      phonenumber: Joi.string().min(8).required(),
      password: Joi.string().min(6).required(),
    });

    return await Joi.validate(credentials, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}

async function signIn(req, res) {
  const credentials = {
    phonenumber: req.body.phonenumber,
    password: req.body.password,
  };

  await validation(credentials);

  const data = await authService.signIn(credentials);

  return res.status(200).send({
    code: 1000,
    data,
  });
}

module.exports = signIn;
