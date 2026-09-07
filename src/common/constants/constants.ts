import { Client, Pool, PoolClient } from 'pg';

export type Queryable = Client | PoolClient | Pool;

export type WhereInParamsType = {
  [key: string]: string[];
};

export const tableNames = {};
