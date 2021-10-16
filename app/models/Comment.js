const { Model } = require('objection');

class Comment extends Model {
  static get tableName() {
    return 'comments';
  }
}

module.exports = Comment;
