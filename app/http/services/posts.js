const { Post, LikePost } = require('../../models');
const { abort } = require('../../helpers/error');
const postStatusEnum = require('../../enums/postStatus');

exports.addPost = async ({ userId, content, type }) => {
  try {
    await Post.query().insert({
      user_id: userId,
      content,
      type,
      status: postStatusEnum.OPEN,
    });
  } catch (error) {
    abort(400, 'Cannot add post');
  }
};

exports.getMyPosts = async ({ userId, limit, offset }) => {
  const posts = await Post.query()
    .where({ user_id: userId })
    .andWhereNot('status', postStatusEnum.CLOSED)
    .withGraphFetched('likes')
    .modifyGraph('likes', (builder) => {
      builder.whereNot('user_id', userId).select('id', 'type');
    })
    .withGraphFetched('likes.user')
    .modifyGraph('likes.user', (builder) => {
      builder.select('id', 'full_name');
    })
    .withGraphFetched('me')
    .modifyGraph('me', (builder) => {
      builder.where('user_id', userId);
    })
    .limit(limit)
    .offset(offset)
    .orderBy('id', 'desc');

  return posts;
};

exports.likePost = async ({
  type, postId, userId,
}) => {
  await LikePost.knexQuery()
    .insert({ type, post_id: postId, user_id: userId })
    .onConflict(['user_id', 'post_id'])
    .merge();
};
