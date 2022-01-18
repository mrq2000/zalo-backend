const Joi = require('joi');

const postsService = require('../../services/posts');
const { abort } = require('../../../helpers/error');

async function validation(postInfo) {
  try {
    const schema = Joi.object().keys({
      postId: Joi.number().integer().min(1).required(),
      userId: Joi.number().integer().min(1).required(),
    });

    return await Joi.validate(postInfo, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}

async function getPostInfo(req, res) {
  const postInfo = {
    postId: req.params.postId,
    userId: req.user.id,
  };
  await validation(postInfo);

  const response = await postsService.getPostInfo(postInfo);
  return res.status(200).send(response);
}

module.exports = getPostInfo;
