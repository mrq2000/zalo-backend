const Joi = require('joi');

const postsService = require('../../services/posts');
const { abort } = require('../../../helpers/error');
const likePostTypeEnum = require('../../../enums/likePostType');

async function validation(postInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      postId: Joi.number().integer().min(1).required(),
      type: Joi.valid(likePostTypeEnum.getValues()).required(),
    });

    return await Joi.validate(postInfo, schema);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function likePost(req, res) {
  const postInfo = {
    userId: req.user.id,
    postId: Number(req.params.postId),
    type: req.body.type,
  };

  await validation(postInfo);
  await postsService.likePost(postInfo);
  return res.status(201).send();
}

module.exports = likePost;
