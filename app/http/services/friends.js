const { raw } = require('objection');

const { FriendRequest, User } = require('../../models');
const friendRequestStatus = require('../../enums/friendRequestStatus');

exports.getFriends = async (userId) => {
  const [{ 'count(`id`)': total }] = await FriendRequest.query()
    .where('status', friendRequestStatus.ACCEPTED)
    .andWhere((builder) => builder.where('sender_id', userId)
      .orWhere('receiver_id', userId))
    .count('id');

  const previewFriends = await FriendRequest.query()
    .where('friend_requests.status', friendRequestStatus.ACCEPTED)
    .andWhere((builder) => builder.where('sender_id', userId)
      .orWhere('receiver_id', userId))
    .limit(9)
    .orderBy('friend_requests.id', 'desc')
    .select(raw(`CASE sender_id WHEN ${userId} THEN receiver_id  ELSE sender_id END as friendId`));

  const previewFriendIds = previewFriends.map((friend) => friend.friendId);
  const friends = await User.query()
    .whereIn('id', previewFriendIds)
    .select('full_name', 'avatar_url', 'id');

  return { friends: { total, data: friends } };
};

exports.myRequest = async ({ userId }) => {
  const friendRequest = await FriendRequest.query()
    .where('receiver_id', userId)
    .where('status', friendRequestStatus.REQUEST)
    .withGraphFetched('sender')
    .modifyGraph('sender', (builder) => {
      builder.select('id', 'full_name', 'avatar_url');
    })
    .select('id', 'created_at')
    .orderBy('id', 'desc');

  return { friendRequest };
};
