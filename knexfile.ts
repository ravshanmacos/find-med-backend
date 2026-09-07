import { Knex } from 'knex';
import process from 'process';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_NAME,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POOL_SIZE,
  POOL_TIMEOUT,
} = process.env;

const poolTimeout = parseInt(POOL_TIMEOUT!, 10);

export const knexConfig: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT!, 10),
    database: POSTGRES_NAME,
    password: POSTGRES_PASSWORD,
    user: POSTGRES_USER,
    application_name: `find_med ${new Date().getTime()}`,
    idle_in_transaction_session_timeout: poolTimeout,
    query_timeout: poolTimeout,
    keepAliveInitialDelayMillis: poolTimeout,
  },
  pool: {
    min: 2,
    max: parseInt(POOL_SIZE!, 10) || 10,
  },
  migrations: {
    directory: './migrations',
  },
};
