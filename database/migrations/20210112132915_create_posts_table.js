const postStatus = require('../../app/enums/postStatus');

exports.up = async (knex) => {
  await knex.schema.createTable('posts', (table) => {
    table.increments('id');
    table.text('described').collate('utf8_general_ci');
    table.text('images').collate('utf8_general_ci');
    table.text('videos').collate('utf8_general_ci');

    table.integer('author_id', 1).unsigned().references('users.id').notNullable();
    table.tinyint('status', 1).unsigned().notNullable().default(postStatus.OPEN);
    table.tinyint('like_count', 1).unsigned().default(0);
    table.tinyint('comment_count', 1).unsigned().default(0);

    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('posts');
};
