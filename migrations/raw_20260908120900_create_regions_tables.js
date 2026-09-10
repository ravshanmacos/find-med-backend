exports.up = async function (knex) {
  return await knex.raw(`
    CREATE TABLE regions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE
    );

    CREATE TABLE districts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      region_id INTEGER NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
      UNIQUE (region_id, name)
    );
  `);
};

exports.down = async function (knex) {
  return await knex.raw(`
    DROP TABLE IF EXISTS districts;
    DROP TABLE IF EXISTS regions;
  `);
};
