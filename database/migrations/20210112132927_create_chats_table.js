exports.up = async (knex) => {
  await knex.schema.createTable('messages', (table) => {
    table.increments('id');
    table.text('content').collate('utf8_general_ci').notNullable();
    table.text('attachments').collate('utf8_general_ci');

    table.integer('sender_id', 1).unsigned().references('users.id').notNullable();
    table.integer('receiver_id', 1).unsigned().references('users.id').notNullable();

    table.timestamps(true, true);

    table.index('sender_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('messages');
};
