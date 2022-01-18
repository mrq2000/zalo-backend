const { transaction } = require('objection');
const { raw } = require('objection');

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
  await User.query().findById(userId)
    .patch({
      avatar_url: mainAvatar,
    });
};

exports.updateFullName = async ({ userId, fullName }) => {
  await User.query().findById(userId)
    .patch({
      full_name: fullName,
    });
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
  userId, count, last_id, myId,
}) => {
  const postQuery = Post.query()
    .where({ author_id: userId });

  if (last_id) {
    postQuery.where((builder) => builder.where('id', '<', last_id));
  }

  const posts = await postQuery
    .andWhereNot('status', postStatusEnum.CLOSED)
    .withGraphFetched('author')
    .modifyGraph('author', (builder) => {
      builder.select('id', 'avatar_url', 'full_name');
    })
    .withGraphFetched('meLike')
    .modifyGraph('meLike', (builder) => {
      builder.where('user_id', myId).select(raw('CASE WHEN user_id is NULL THEN "false" ELSE "true" END as user_exists'));
    })
    .limit(count)
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
