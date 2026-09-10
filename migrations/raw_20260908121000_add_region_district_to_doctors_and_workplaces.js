exports.up = async function (knex) {
  return await knex.raw(`
    ALTER TABLE doctors
      ADD COLUMN region_id INTEGER REFERENCES regions(id),
      ADD COLUMN district_id INTEGER REFERENCES districts(id);

    ALTER TABLE workplaces
      ADD COLUMN region_id INTEGER REFERENCES regions(id),
      ADD COLUMN district_id INTEGER REFERENCES districts(id);
  `);
};

exports.down = async function (knex) {
  return await knex.raw(`
    ALTER TABLE doctors
      DROP COLUMN IF EXISTS region_id,
      DROP COLUMN IF EXISTS district_id;

    ALTER TABLE workplaces
      DROP COLUMN IF EXISTS region_id,
      DROP COLUMN IF EXISTS district_id;
  `);
};
