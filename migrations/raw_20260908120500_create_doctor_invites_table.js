exports.up = async function (knex) {
  return await knex.raw(`
    CREATE TABLE doctor_invites (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
      token_hash VARCHAR(255) NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX idx_doctor_invites_doctor_id ON doctor_invites(doctor_id);
  `);
};

exports.down = async function (knex) {
  return await knex.raw(`
    DROP TABLE IF EXISTS doctor_invites;
  `);
};
