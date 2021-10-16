const Enum = require('./Enum.js');

class LikePostType extends Enum {
  getGender(key) {
    switch (key) {
      case this.LIKE:
        return 'Thích';
      case this.HAHA:
        return 'Ha Ha';
      case this.ANGRY:
        return 'Tức giận';
      case this.SAD:
        return 'Buồn';
      case this.LOVE:
        return 'Yêu Thích';
      default:
        return '';
    }
  }
}

module.exports = new LikePostType({
  LIKE: 1,
  HAHA: 2,
  ANGRY: 3,
  SAD: 4,
  LOVE: 5,
  UNLIKE: 6,
});
