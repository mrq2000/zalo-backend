const { Message } = require('../app/models');
const { getUserData } = require('./user');

exports.newMessage = async (user, { receiver_id, message }) => {
  try {
    const res = await Message.query().insert({
      sender_id: user.id,
      receiver_id,
      content: message,
    });
    return { status: true, user: getUserData(receiver_id), newMessage: res };
  } catch (e) {
    return { status: false };
  }
};
