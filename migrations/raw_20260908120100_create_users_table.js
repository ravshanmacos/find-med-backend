exports.up = async function (knex) {
  return await knex.raw(`
    CREATE TYPE user_role AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN');

    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      phone VARCHAR(50) UNIQUE,
      role user_role NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
};

exports.down = async function (knex) {
  return await knex.raw(`
    DROP TABLE IF EXISTS users;
    DROP TYPE IF EXISTS user_role;
  `);
};
