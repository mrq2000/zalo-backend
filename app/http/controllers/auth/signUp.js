const Joi = require('joi');

const authService = require('../../services/auth');
const { abort } = require('../../../helpers/error');
const genderEnums = require('../../../enums/gender');

async function validation(userInfo) {
  try {
    const schema = Joi.object().keys({
      providerAccessToken: Joi.string().required(),
      fullName: Joi.string().max(127).required(),
      birthday: Joi.date().required(),
      gender: Joi.valid(genderEnums.getValues()).required(),
      province: Joi.string().max(63).required(),
      district: Joi.string().max(63).required(),
      location: Joi.string().max(255).allow(null),
    });

    return await Joi.validate(userInfo, schema);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function signIn(req, res) {
  const userInfo = {
    providerAccessToken: req.body.providerAccessToken,
    fullName: req.body.fullName,
    gender: req.body.gender,
    birthday: req.body.birthday,
    province: req.body.province,
    district: req.body.district,
    location: req.body.location,
  };
  await validation(userInfo);

  const responseData = await authService.signUp(userInfo);
  return res.status(200).send(responseData);
}

module.exports = signIn;
