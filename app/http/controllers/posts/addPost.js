const Joi = require('joi');

const postsService = require('../../services/posts');
const { abort } = require('../../../helpers/error');

async function validation(postInfo) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.number().integer().min(1).required(),
      described: Joi.string().required(),
      image: Joi.array(),
      video: Joi.string(),
    });

    return await Joi.validate(postInfo, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}

async function addPost(req, res) {
  const images = req.files || [];

  const postInfo = {
    userId: req.user.id,
    described: req.body.described,
    image: JSON.stringify(images.map((image) => image.location)),
    video: req.video,
  };

  await validation(postInfo);

  const data = await postsService.addPost(postInfo);
  return res.status(201).send({
    code: 1000,
    data,
  });
}

module.exports = addPost;
