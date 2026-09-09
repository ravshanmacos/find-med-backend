exports.up = async function (knex) {
  return await knex.raw(`
    CREATE TABLE workplaces (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      address VARCHAR(500),
      phone VARCHAR(50),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE doctor_workplaces (
      doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
      workplace_id UUID NOT NULL REFERENCES workplaces(id) ON DELETE CASCADE,
      PRIMARY KEY (doctor_id, workplace_id)
    );
  `);
};

exports.down = async function (knex) {
  return await knex.raw(`
    DROP TABLE IF EXISTS doctor_workplaces;
    DROP TABLE IF EXISTS workplaces;
  `);
};
