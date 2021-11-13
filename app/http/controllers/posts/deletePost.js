const Joi = require('joi');

const postsService = require('../../services/posts');
const { abort } = require('../../../helpers/error');

async function validation(postInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      postId: Joi.number().integer().min(1).required(),
    });

    return await Joi.validate(postInfo, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}

async function deletePost(req, res) {
  const postInfo = {
    userId: req.user.id,
    postId: req.body.id,
  };

  await validation(postInfo);

  await postsService.deletePost(postInfo);
  return res.status(201).send({
    code: 10000,
    message: 'done',
  });
}

module.exports = deletePost;
