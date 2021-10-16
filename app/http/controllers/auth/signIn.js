const Joi = require('joi');

const authService = require('../../services/auth');
const { abort } = require('../../../helpers/error');

async function validation(credentials) {
  try {
    const schema = Joi.object().keys({
      phoneNumber: Joi.string().required(),
      password: Joi.string().required(),
    });

    return await Joi.validate(credentials, schema);
  } catch (error) {
    // console.log(error, 1111111);
    return abort(400, 'Params error');
  }
}

async function signIn(req, res) {
  const credentials = {
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
  };

  await validation(credentials);

  const responseData = await authService.signIn(credentials);
  return res.status(200).send(responseData);
}

module.exports = signIn;
