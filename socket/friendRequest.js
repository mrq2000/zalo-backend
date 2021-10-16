const { getUserData, getUser } = require('./user');
const { FriendRequest } = require('../app/models');
const friendRequestStatus = require('../app/enums/friendRequestStatus');

exports.newFriendRequest = async ({ token, userId }) => {
  const me = await getUser(token);
  const user = getUserData(userId);

  if (me) {
    await FriendRequest.knexQuery()
      .insert({ sender_id: me.id, receiver_id: userId, status: friendRequestStatus.REQUEST })
      .onConflict(['sender_id', 'receiver_id'])
      .merge();

    if (user) {
      return { user, me };
    }

    return true;
  }
  return false;
};

exports.acceptFriendRequest = async ({ token, userId }) => {
  const me = await getUser(token);
  const user = getUserData(userId);

  if (me) {
    const friendRequest = await FriendRequest.query()
      .where('sender_id', userId)
      .where('receiver_id', me.id)
      .first();

    if (friendRequest && friendRequest.status === friendRequestStatus.REQUEST) {
      await friendRequest.$query().update({
        status: friendRequestStatus.ACCEPTED,
      });
    } else {
      return false;
    }

    if (user) {
      return { user, me };
    }

    return true;
  }
  return false;
};
