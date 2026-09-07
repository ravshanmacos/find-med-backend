import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import * as process from 'process';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_NAME,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;

@Injectable()
export class PoolService {
  public readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionTimeoutMillis: parseInt(process.env.POOL_TIMEOUT!),
      max: parseInt(process.env.POOL_SIZE!),
      application_name: ` pool_service_crop_api: ${new Date().getTime()}`,
      host: POSTGRES_HOST,
      port: parseInt(POSTGRES_PORT!, 10),
      database: POSTGRES_NAME,
      password: POSTGRES_PASSWORD,
      user: POSTGRES_USER,
    });
  }

  onModuleDestroy() {
    this.pool.end();
  }
}
