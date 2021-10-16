const Joi = require('joi');

const suggestService = require('../../services/suggest');
const { abort } = require('../../../helpers/error');

async function validation(searchInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      keyword: Joi.string().required(),
      offset: Joi.number().integer().required(),
      limit: Joi.number().integer().required(),
    });

    return await Joi.validate(searchInfo, schema);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function suggestMyFriend(req, res) {
  const searchInfo = {
    userId: req.user.id,
    keyword: req.query.keyword,
    offset: req.query.offset,
    limit: req.query.limit,
  };

  await validation(searchInfo);

  const responseData = await suggestService.suggestMyFriend(searchInfo);
  return res.status(200).send(responseData);
}

module.exports = suggestMyFriend;
