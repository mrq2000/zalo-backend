exports.up = async (knex) => {
  await knex.schema.createTable('friend_requests', (table) => {
    table.increments('id');
    table.tinyint('status', 1).unsigned().notNullable();

    table.integer('sender_id', 1).unsigned().references('users.id').notNullable();
    table.integer('receiver_id', 1).unsigned().references('users.id').notNullable();

    table.timestamps(true, true);

    table.index('sender_id');
    table.index('receiver_id');

    table.unique(['sender_id', 'receiver_id']);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('friend_requests');
};
