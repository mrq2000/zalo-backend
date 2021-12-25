const users = {};

exports.addUser = async (socketId, user) => {
  if (user) {
    users[user.id] = {
      online: true,
      socketId,
    };
  }
};

exports.removeUser = async (user, socketId) => {
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
