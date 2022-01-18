/* eslint-disable global-require */
const { Model } = require('objection');

class Comment extends Model {
  static get tableName() {
    return 'comments';
  }

  static get relationMappings() {
    const User = require('./User');

    return {
      author: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'comments.user_id',
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Comment;
