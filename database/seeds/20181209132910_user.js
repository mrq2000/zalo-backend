const bcrypt = require('bcryptjs');

const userStatusEnum = require('../../app/enums/userStatus');
const userGenderEnum = require('../../app/enums/userGender');

const password = bcrypt.hashSync('123456');

exports.seed = async (knex) => {
  await knex('users').insert([{
    phone_number: '111111111',
    password,
    full_name: 'Bot 1',
    gender: userGenderEnum.MALE,
    birthday: '2000/03/02',
    status: userStatusEnum.ACTIVE,
  }]);
};
