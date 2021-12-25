const { transaction } = require('objection');

const { User, Post, FriendRequest } = require('../../models');
const { abort } = require('../../helpers/error');
const postStatusEnum = require('../../enums/postStatus');
const postTypeEnum = require('../../enums/postType');

exports.getMyInformation = async (userId) => {
  const userInfo = await User
    .query()
    .findById(userId);

  if (!userInfo) return abort(400, 'User not found');

  return userInfo;
};

exports.updateAvatar = async ({ userId, mainAvatar }) => {
  try {
    await transaction(User, Post, async (UserTrx, PostTrx) => {
      await UserTrx.query().findById(userId)
        .patch({
          avatar_url: mainAvatar,
        });
      await PostTrx.query().insert({
        user_id: userId,
        type: postTypeEnum.PUBLIC,
        status: postStatusEnum.OPEN,
        image_name: mainAvatar,
      });
    });
  } catch (error) {
    abort(500, 'Cannot update your avatar');
  }
};

exports.getUserInformation = async ({ userId, myId }) => {
  const userInfo = await User
    .query()
    .findById(userId);

  if (!userInfo) return abort(400, 'User not found');

  const friendStatus = await FriendRequest.query()
    .where((builder) => builder.where('sender_id', userId).where('receiver_id', myId))
    .orWhere((builder) => builder.where('sender_id', myId).where('receiver_id', userId))
    .first();

  return { ...userInfo, friendStatus };
};

exports.getUserPosts = async ({
  userId, limit, offset, myId,
}) => {
  const posts = await Post.query()
    .where({ user_id: userId })
    .andWhereNot('status', postStatusEnum.CLOSED)
    .andWhereNot('type', postTypeEnum.PRIVATE)
    .withGraphFetched('likes')
    .modifyGraph('likes', (builder) => {
      builder.whereNot('user_id', myId).select('id', 'type');
    })
    .withGraphFetched('likes.user')
    .modifyGraph('likes.user', (builder) => {
      builder.select('id', 'full_name');
    })
    .withGraphFetched('me')
    .modifyGraph('me', (builder) => {
      builder.where('user_id', myId);
    })
    .limit(limit)
    .offset(offset)
    .orderBy('id', 'desc');

  return posts;
};

exports.getUserInfo = async (userId) => {
  const userInfo = await User.query().findById(userId).select('id', 'full_name', 'avatar_url');

  if (!userInfo) abort(400, 'user not found', 995);

  return userInfo;
};

exports.getUserInfoByPhoneNumber = async (phonenumber) => {
  const userInfo = await User.query().where('phonenumber', phonenumber).first().select('id', 'full_name', 'avatar_url', 'phonenumber');

  if (!userInfo) abort(400, 'user not found', 995);

  return userInfo;
};

exports.getUserList = async (userIds) => {
  const userInfos = await User.query().whereIn('id', userIds).select('id', 'full_name', 'avatar_url');

  return userInfos;
};
