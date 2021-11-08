const Joi = require('joi');

const postsService = require('../../services/posts');
const { abort } = require('../../../helpers/error');

async function validation(postInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      last_id: Joi.number().integer().required(),
      count: Joi.number().integer().required(),
      index: Joi.number().integer().required(),
    });

    return await Joi.validate(postInfo, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}

async function getPostList(req, res) {
  const postInfo = {
    userId: req.user.id,
    last_id: req.query.last_id,
    count: req.query.count,
    index: req.query.index,
  };

  await validation(postInfo);

  const data = await postsService.getPostList(postInfo);
  return res.status(200).send({
    code: 10000,
    data,
  });
}

module.exports = getPostList;
