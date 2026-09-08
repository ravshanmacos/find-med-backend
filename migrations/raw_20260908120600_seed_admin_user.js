const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

exports.up = async function (knex) {
  const email = process.env.ADMIN_EMAIL || 'admin@findmed.uz';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD environment variable topilmadi. .env fayliga qo'shing yoki " +
        'ADMIN_PASSWORD=xavfsizParol123 npx knex migrate:latest tarzida bering.',
    );
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return await knex.raw(
    `
      INSERT INTO users (email, password_hash, role, is_active)
      VALUES (?, ?, 'ADMIN', true)
      ON CONFLICT (email) DO NOTHING;
    `,
    [email, passwordHash],
  );
};

exports.down = async function (knex) {
  const email = process.env.ADMIN_EMAIL || 'admin@findmed.uz';

  return await knex.raw(
    `
      DELETE FROM users WHERE email = ? AND role = 'ADMIN';
    `,
    [email],
  );
};
