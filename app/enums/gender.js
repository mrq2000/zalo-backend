const Enum = require('./Enum.js');

class Gender extends Enum {
  getGender(key) {
    switch (key) {
      case this.MALE:
        return 'Nam';
      case this.FEMALE:
        return 'Nữ';
      case this.OTHER:
        return 'Khác';
      default:
        return '';
    }
  }
}

module.exports = new Gender({
  MALE: 1,
  FEMALE: 2,
  OTHER: 3,
});
