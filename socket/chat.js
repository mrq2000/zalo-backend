const { Message } = require('../app/models');
const { getUser } = require('./user');

exports.newMessage = async ({ token, userId, message }) => {
  const user = await getUser(token);
  if (!user) return false;

  try {
    await Message.query().insert({
      sender_id: user.id,
      receiver_id: userId,
      described: message,
    });

    return true;
  } catch (e) {
    return false;
  }
};
