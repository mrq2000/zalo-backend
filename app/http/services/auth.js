/* eslint-disable import/prefer-default-export */
const { compareSync } = require('bcryptjs');

const { User } = require('../../models');
const { abort } = require('../../helpers/error');
const jwt = require('../../helpers/jwt');
const userStatusEnum = require('../../enums/userStatus');

exports.signIn = async ({ phoneNumber, password }) => {
  const user = await User.query().where({ phone_number: phoneNumber }).first();
  if (!user) return abort(400, 'Invalid phone number');
  if (user.status === userStatusEnum.INACTIVE) return abort(400, 'User blocked');

  const isTruePassword = compareSync(password, user.password);
  if (!isTruePassword) return abort(400, 'Username or password was wrong!');
  const accessToken = jwt.generate({ userId: user.id });

  return {
    userId: user.id,
    accessToken,
  };
};
