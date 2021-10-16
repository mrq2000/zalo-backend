const Joi = require('joi');

const postsService = require('../../services/posts');
const { abort } = require('../../../helpers/error');

async function validation(postInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      offset: Joi.number().integer().required(),
      limit: Joi.number().integer().required(),
    });

    return await Joi.validate(postInfo, schema);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function getMyPosts(req, res) {
  const postInfo = {
    userId: req.user.id,
    offset: req.query.offset,
    limit: req.query.limit,
  };

  await validation(postInfo);

  const response = await postsService.getMyPosts(postInfo);
  return res.status(200).send(response);
}

module.exports = getMyPosts;
