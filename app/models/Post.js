/* eslint-disable global-require */
const { Model } = require('objection');

class Post extends Model {
  static get tableName() {
    return 'posts';
  }

  static get relationMappings() {
    const LikePost = require('./LikePost');
    const User = require('./User');

    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'posts.user_id',
          to: 'users.id',
        },
      },
      likes: {
        relation: Model.HasManyRelation,
        modelClass: LikePost,
        join: {
          from: 'posts.id',
          to: 'like_post.post_id',
        },
      },
      me: {
        relation: Model.HasOneRelation,
        modelClass: LikePost,
        join: {
          from: 'posts.id',
          to: 'like_post.post_id',
        },
      },
    };
  }
}

module.exports = Post;
