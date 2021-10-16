const Joi = require('joi');

const postsService = require('../../services/posts');
const { abort } = require('../../../helpers/error');

async function validation(postInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      postId: Joi.number().integer().min(1).required(),
      content: Joi.string().required(),
      relate_comment_id: Joi.number().integer().min(1),
      image_name: Joi.string(),
    });

    return await Joi.validate(postInfo, schema);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function commentPost(req, res) {
  const postInfo = {
    userId: req.user.id,
    postId: req.body.postId,
    content: req.body.content,
    relate_comment_id: req.body.relate_comment_id,
    image_name: req.body.image_name,
  };

  await validation(postInfo);

  await postsService.commentPost(postInfo);
  return res.status(201).send();
}

module.exports = commentPost;
