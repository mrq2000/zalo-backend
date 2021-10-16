/* eslint-disable import/no-self-import */
/* eslint-disable global-require */
const { Model } = require('objection');

class LikePost extends Model {
  static get tableName() {
    return 'friend_requests';
  }

  static get relationMappings() {
    const User = require('./User');

    return {
      sender: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'friend_requests.sender_id',
        },
      },
      receiver: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'friend_requests.receiver_id',
        },
      },
    };
  }
}

module.exports = LikePost;
