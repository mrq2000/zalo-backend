const Joi = require('joi');

const notiService = require('../../services/notifications');
const { abort } = require('../../../helpers/error');

async function validation(postInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      last_id: Joi.number().integer().allow(''),
      count: Joi.number().integer().required(),
    });

    return await Joi.validate(postInfo, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}

async function getAllNoti(req, res) {
  const postInfo = {
    userId: req.user.id,
    last_id: req.query.last_id,
    count: req.query.count,
  };

  await validation(postInfo);

  const response = await notiService.getAllNoti(postInfo);
  return res.status(200).send(response);
}

module.exports = getAllNoti;
