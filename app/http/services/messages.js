const { raw } = require('objection');
const { Message } = require('../../models');

exports.getFriendMessages = async ({
  friendId, userId, cursor, limit,
}) => {
  const messagesQuery = Message.query();
  if (cursor !== 'null') {
    messagesQuery.where('id', '<', cursor);
  }

  messagesQuery.where((builderFirst) => builderFirst.where((builder) => builder.where('sender_id', userId).andWhere('receiver_id', friendId))
    .orWhere((builder) => builder.where('sender_id', friendId).andWhere('receiver_id', userId)))
    .orderBy('id', 'desc')
    .limit(limit)
    .select('id', 'content', 'sender_id', 'created_at');

  const response = await messagesQuery;

  return {
    messages: response,
    nextCursor: response.length === limit ? response[response.length - 1].id : false,
  };
};

exports.getMessagesList = async ({ userId, offset, limit }) => {
  const messages = await Message.query()
    .andWhere((builder) => builder.where('sender_id', userId)
      .orWhere('receiver_id', userId))
    .select(raw(`CASE receiver_id WHEN ${userId} THEN receiver_id  ELSE sender_id END as myId`))
    .select(raw(`CASE sender_id WHEN ${userId} THEN receiver_id  ELSE sender_id END as friendId`))
    .max('id as id')
    .groupBy('myId', 'friendId')
    .orderBy('id', 'desc')
    .limit(limit)
    .offset(offset);

  const ids = messages.map((message) => message.id);
  const response = await Message.query().whereIn('messages.id', ids)
    .select(raw(`CASE sender_id WHEN ${userId} THEN receiver_id  ELSE sender_id END as friendId`))
    .select('messages.created_at', 'content', 'messages.sender_id')
    .orderBy('messages.id', 'desc')
    .leftJoin('users', 'users.id', raw(`CASE sender_id WHEN ${userId} THEN receiver_id  ELSE sender_id END`))
    .select('users.full_name', 'avatar_url');

  return response;
};
