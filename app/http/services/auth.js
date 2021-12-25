/* eslint-disable import/prefer-default-export */
const bcrypt = require('bcryptjs');

const { User } = require('../../models');
const { abort } = require('../../helpers/error');
const jwt = require('../../helpers/jwt');
const userStatusEnum = require('../../enums/userStatus');

exports.signIn = async ({ phonenumber, password }) => {
  const user = await User.query().where({ phonenumber }).first();
  if (!user) return abort(400, 'Invalid phone number', 9996);

  const isTruePassword = bcrypt.compareSync(password, user.password);
  if (!isTruePassword) return abort(400, 'Username or password was wrong!', 1004);
  if (user.status === userStatusEnum.INACTIVE) return abort(400, 'User blocked', 1009);

  const accessToken = jwt.generate({ userId: user.id });

  return {
    token: accessToken,
  };
};

exports.signUp = async ({ phonenumber, password, fullName }) => {
  const user = await User.query().where({ phonenumber }).first();
  if (user) return abort(400, 'User existed', 9996);

  const userInfo = await User.query().insert({
    phonenumber, password: bcrypt.hashSync(password), status: userStatusEnum.ACTIVE, full_name: fullName,
  });

  const accessToken = jwt.generate({ userId: userInfo.id });
  return {
    token: accessToken,
  };
};
