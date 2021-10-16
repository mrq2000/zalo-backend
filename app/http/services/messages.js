const { Message } = require('../../models');

exports.getFriendMessages = async ({
  friendId, userId, cursor, limit,
}) => {
  const messagesQuery = Message.query();

  if (cursor) {
    messagesQuery.where('id', '<', cursor);
  }

  messagesQuery.where((builder) => builder.where('sender_id', userId).andWhere('receiver_id', friendId))
    .orWhere((builder) => builder.where('sender_id', friendId).andWhere('receiver_id', userId))
    .orderBy('id', 'desc')
    .limit(limit)
    .select('id', 'content', 'sender_id', 'created_at');

  const response = await messagesQuery;

  return {
    messages: response,
    nextCursor: response.length === limit ? response[response.length - 1].id : false,
  };
};
