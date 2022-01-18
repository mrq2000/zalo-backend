const { getUserData } = require('./user');
const { FriendRequest, Notification } = require('../app/models');
const friendRequestStatus = require('../app/enums/friendRequestStatus');
const notification = require('../app/enums/notification');

exports.newFriendRequest = async (userInfo, userReceiverId) => {
  await FriendRequest.knexQuery()
    .insert({ sender_id: userInfo.id, receiver_id: userReceiverId, status: friendRequestStatus.REQUEST })
    .onConflict(['sender_id', 'receiver_id'])
    .merge();

  await Notification.query().insert({
    status: notification.FRIEND_REQUEST,
    content: userInfo.id,
    owner_id: userReceiverId,
  });

  return { user: getUserData(userReceiverId), status: true };
};

exports.acceptFriendRequest = async (userInfo, senderId) => {
  const friendRequest = await FriendRequest.query()
    .where('sender_id', senderId)
    .where('receiver_id', userInfo.id)
    .first();

  if (friendRequest && friendRequest.status === friendRequestStatus.REQUEST) {
    await friendRequest.$query().update({
      status: friendRequestStatus.ACCEPTED,
    });
  } else {
    return { status: false };
  }

  await Notification.query().insert({
    status: notification.FRIEND_ACCEPT,
    content: userInfo.id,
    owner_id: senderId,
  });

  return {
    status: true, user: getUserData(senderId),
  };
};
