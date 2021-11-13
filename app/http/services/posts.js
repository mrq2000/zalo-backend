const { transaction } = require('objection');
const { raw } = require('objection');

const { Post, LikePost, FriendRequest } = require('../../models');
const postStatusEnum = require('../../enums/postStatus');
const likePostType = require('../../enums/likePostType');
const friendRequestStatus = require('../../enums/friendRequestStatus');
const { abort } = require('../../helpers/error');
const knex = require('../../../database/knex');
const { getFriendId } = require('./friends');
const postStatus = require('../../enums/postStatus');

exports.addPost = async ({
  userId, described, image, video,
}) => {
  const post = await Post.query().insert({
    author_id: userId,
    described,
    image,
    video,
  });

  return { id: post.id };
};

exports.getMyPosts = async ({
  userId, count, last_id,
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
      builder.where('user_id', userId).select(raw('CASE WHEN user_id is NULL THEN "false" ELSE "true" END as user_exists'));
    })
    .limit(count)
    .orderBy('id', 'desc');

  return posts;
};

exports.getPostList = async ({
  userId, count, last_id, index,
}) => {
  const friendIds = await getFriendId(userId);
  const postQuery = Post.query()
    .whereIn('author_id', friendIds);

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
      builder.where('user_id', userId).select(raw('CASE WHEN user_id is NULL THEN "false" ELSE "true" END as user_exists'));
    })
    .limit(count)
    .orderBy('id', 'desc');

  return posts;
};

exports.likePost = async ({
  type, postId, userId,
}) => {
  try {
    await transaction(LikePost, Post, async (LikePostTrx, PostTrx) => {
      const likeInfo = await LikePost.query().where({ post_id: postId, user_id: userId });

      if (!likeInfo) {
        if (type === likePostType.LIKE) {
          await PostTrx.query().increment('like_count', 1);
          await LikePostTrx.query().insert({
            type, post_id: postId, user_id: userId,
          });
        }
      } else {
        if (likeInfo.type === type) return;
        const increase = type === likePostType.LIKE ? 1 : -1;
        await PostTrx.query().increment('like_count', increase);
        await LikePostTrx.query().update({
          type,
        });
      }
    });
  } catch (error) {
    abort(500, 'Cannot update your avatar');
  }
};

exports.deletePost = async ({ postId, userId }) => {
  const postInfo = await Post.query().where('id', '=', postId).first();

  if (!postInfo) {
    abort(400, 'Not found Post', 9992);
  }

  if (postInfo.author_id !== userId) {
    abort(400, 'You not a author', 1009);
  }

  await Post.query().where('id', '=', postId).update({
    status: postStatus.CLOSED,
  });
};
