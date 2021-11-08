const Joi = require('joi');

const userService = require('../../services/user');
const { abort } = require('../../../helpers/error');

async function validation(postInfo) {
  try {
    const schema = Joi.object().keys({
      mainAvatar: Joi.string().required(),
      userId: Joi.number().integer().min(1).required(),
    });

    return await Joi.validate(postInfo, schema);
  } catch (error) {
    return abort(400, 'Params error', 1004);
  }
}

async function updateAvatar(req, res) {
  const avatarInfo = {
    mainAvatar: req.mainAvatar,
    userId: req.user.id,
  };

  await validation(avatarInfo);

  await userService.updateAvatar(avatarInfo);
  return res.status(204).send();
}

module.exports = updateAvatar;
