const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

module.exports = {
  client: process.env.DB_TYPE,
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'migrations',
    directory: './database/migrations',
  },
  seeds: {
    directory: './database/seeds',
  },
};
