exports.up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('phonenumber', 15).notNullable();
    table.string('password', 127).notNullable();
    table.string('full_name', 127).collate('utf8_general_ci');
    table.tinyint('gender', 1).unsigned();
    table.date('birthday');
    table.tinyint('status', 1).unsigned().notNullable();

    table.string('avatar_url', 255).collate('utf8_general_ci');
    table.string('cover_url', 255).collate('utf8_general_ci');

    table.text('device');
    table.text('current_token');

    table.timestamps(true, true);

    table.unique(['phonenumber'], 'phonenumber');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('users');
};
