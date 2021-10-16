const Enum = require('./Enum.js');

class Gender extends Enum {
  getPostTypeTitle(key) {
    switch (key) {
      case this.PRIVATE:
        return 'Chỉ mình tôi';
      case this.PUBLIC:
        return 'Công khai';
      default:
        return '';
    }
  }
}

module.exports = new Gender({
  PRIVATE: 1,
  PUBLIC: 2,
});
