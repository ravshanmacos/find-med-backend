exports.up = async function (knex) {
  return await knex.raw(`
    CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE');

    CREATE TABLE patients (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      full_name VARCHAR(255) NOT NULL,
      birth_date DATE,
      gender gender_type,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
};

exports.down = async function (knex) {
  return await knex.raw(`
    DROP TABLE IF EXISTS patients;
    DROP TYPE IF EXISTS gender_type;
  `);
};
