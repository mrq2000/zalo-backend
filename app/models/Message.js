/* eslint-disable import/no-self-import */
/* eslint-disable global-require */
const { Model } = require('objection');

class Chats extends Model {
  static get tableName() {
    return 'messages';
  }

  static get relationMappings() {
    const User = require('./User');

    return {
      sender: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'chats.sender_id',
        },
      },
      receiver: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'chats.receiver_id',
        },
      },
    };
  }
}

module.exports = Chats;
