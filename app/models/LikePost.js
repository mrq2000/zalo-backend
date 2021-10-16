/* eslint-disable global-require */
const { Model } = require('objection');

class LikePost extends Model {
  static get tableName() {
    return 'like_post';
  }

  static get relationMappings() {
    const User = require('./User');
    const Post = require('./Post');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'like_post.user_id',
          to: 'users.id',
        },
      },
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: Post,
        join: {
          from: 'like_post.post_id',
          to: 'posts.id',
        },
      },
    };
  }
}

module.exports = LikePost;
