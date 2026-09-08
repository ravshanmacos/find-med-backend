exports.up = async function (knex) {
  return await knex.raw(`
    CREATE TABLE specialties (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE
    );

    CREATE TABLE doctor_specialties (
      doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
      specialty_id INTEGER NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
      PRIMARY KEY (doctor_id, specialty_id)
    );
  `);
};

exports.down = async function (knex) {
  return await knex.raw(`
    DROP TABLE IF EXISTS doctor_specialties;
    DROP TABLE IF EXISTS specialties;
  `);
};
