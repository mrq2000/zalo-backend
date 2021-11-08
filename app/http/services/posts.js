const { transaction } = require('objection');

const { Post, LikePost } = require('../../models');
const postStatusEnum = require('../../enums/postStatus');
const likePostType = require('../../enums/likePostType');
const { abort } = require('../../helpers/error');

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
  const posts = await Post.query()
    .where({ author_id: userId })
    .where('id', '<', last_id)
    .andWhereNot('status', postStatusEnum.CLOSED)
    .withGraphFetched('me')
    .modifyGraph('me', (builder) => {
      builder.where('author_id', userId);
    })
    .limit(count)
    .orderBy('id', 'desc');

  return posts;
};

exports.getPostList = async ({
  userId, count, last_id, index,
}) => {
  const posts = await Post.query()
    .where((builder) => builder.where('id', '<', last_id).orWhere('id', '>', index))
    .andWhereNot('status', postStatusEnum.CLOSED)
    .withGraphFetched('author')
    .modifyGraph('author', (builder) => {
      builder.select('id', 'avatar_url', 'full_name');
    })
    .withGraphFetched('meLike')
    .modifyGraph('meLike', (builder) => {
      builder.where('author_id', userId);
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
