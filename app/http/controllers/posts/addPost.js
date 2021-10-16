const Joi = require('joi');

const postsService = require('../../services/posts');
const { abort } = require('../../../helpers/error');
const postTypeEnum = require('../../../enums/postType');

async function validation(postInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      content: Joi.string().required(),
      type: Joi.valid(postTypeEnum.getValues()).required(),
    });

    return await Joi.validate(postInfo, schema);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function addPost(req, res) {
  const postInfo = {
    userId: req.user.id,
    content: req.body.content,
    type: req.body.type,
  };

  await validation(postInfo);

  await postsService.addPost(postInfo);
  return res.status(201).send();
}

module.exports = addPost;
