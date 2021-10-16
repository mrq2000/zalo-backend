/* eslint-disable global-require */
const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    const FriendRequest = require('./FriendRequest');

    return {
      senderFriendRequests: {
        relation: Model.HasManyRelation,
        modelClass: FriendRequest,
        join: {
          from: 'users.id',
          to: 'friend_requests.sender_id',
        },
      },
      receiverFriendRequests: {
        relation: Model.HasManyRelation,
        modelClass: FriendRequest,
        join: {
          from: 'users.id',
          to: 'friend_requests.receiver_id',
        },
      },
      meSendRequest: {
        relation: Model.HasOneRelation,
        modelClass: FriendRequest,
        join: {
          from: 'users.id',
          to: 'friend_requests.sender_id',
        },
      },
      meReceiveRequest: {
        relation: Model.HasOneRelation,
        modelClass: FriendRequest,
        join: {
          from: 'users.id',
          to: 'friend_requests.receiver_id',
        },
      },
    };
  }
}

module.exports = User;
