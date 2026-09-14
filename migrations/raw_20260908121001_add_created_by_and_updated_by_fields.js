exports.up = async function (knex) {
  return await knex.raw(`
--     alter table workplaces
--     add column if not exists created_by uuid references users(id),
--     add column if not exists updated_by uuid references users(id);
  `);
};

exports.down = async function (knex) {
  return await knex.raw(`
--     alter table workplaces
--     drop column if exists created_by,
--     drop column if exists updated_by
  `);
};
