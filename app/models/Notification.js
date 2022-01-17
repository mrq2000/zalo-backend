/* eslint-disable import/no-self-import */
/* eslint-disable global-require */
const { Model } = require('objection');

class Notifications extends Model {
  static get tableName() {
    return 'notifications';
  }

  static get relationMappings() {
    const User = require('./User');

    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'notifications.owner_id',
        },
      },
    };
  }
}

module.exports = Notifications;
