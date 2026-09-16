import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import process from 'process';

@Injectable()
export class CronPoolService {
  public readonly pool: Pool;

  constructor(name = '') {
    const {
      POSTGRES_HOST,
      POSTGRES_PORT,
      POSTGRES_NAME,
      POSTGRES_USER,
      POSTGRES_PASSWORD,
    } = process.env;

    this.pool = new Pool({
      host: POSTGRES_HOST,
      port: parseInt(POSTGRES_PORT!, 10),
      database: POSTGRES_NAME,
      password: POSTGRES_PASSWORD,
      user: POSTGRES_USER,
      connectionTimeoutMillis: parseInt(process.env.POOL_TIMEOUT!),
      max: parseInt(process.env.POOL_SIZE!),
      application_name: ` cron_api: ${name} ${new Date().getTime()}`,
    });
  }

  onModuleDestroy() {
    this.pool.end();
  }
}
