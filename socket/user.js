const { User } = require('../app/models');
const jwt = require('../app/helpers/jwt');

const users = {};

exports.getUser = async (token) => {
  const payload = await jwt.parse(token);

  if (payload === false) return false;
  const user = await User.query().findOne({ id: payload.userId }).select('id', 'full_name', 'avatar_url');
  if (!user) return false;

  return user;
};

exports.addUser = async (token, socketId) => {
  const user = await this.getUser(token);
  if (user) {
    users[user.id] = {
      online: true,
      socketId,
    };
  }
};

exports.removeUser = async (token, socketId) => {
  const user = await this.getUser(token);

  if (user) {
    users[user.id] = {
      online: false,
      socketId,
      lastOnline: Date.now(),
    };
  }
};

exports.checkUserList = async (userIds) => {
  const result = {};

  userIds.forEach((userId) => {
    if (users[userId]) {
      result[userId] = users[userId];
    } else {
      result[userId] = {
        online: false,
      };
    }
  });

  return result;
};

exports.getUserData = (userId) => users[userId];
