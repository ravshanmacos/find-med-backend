import process from 'process';
import { Queryable, WhereInParamsType } from './common/constants/constants';
import { QueryBuilder } from './common/types';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';

type Executor<T> = (poolClient: PoolClient) => Promise<T>;

export const wrapInTransaction = async <T>(
  pool: Pool,
  executor: Executor<T>,
) => {
  const poolClient = await pool.connect();
  await poolClient.query('begin');
  try {
    const result = await executor(poolClient);
    await poolClient.query('commit');
    return result;
  } catch (error) {
    await poolClient.query('rollback');
    throw error;
  } finally {
    poolClient.release();
  }
};

export const runKnex = <T extends QueryResultRow>(
  queryable: Queryable,
  knexBuilder: QueryBuilder,
  request?: any,
) => {
  const { sql, bindings } = knexBuilder.toSQL().toNative();
  if (process.env.SQL_DEBUG == 'true') {
    console.log(`sql_debugger: ${knexBuilder.toQuery()}`);
  }
  return queryable.query<T>({ text: sql, values: bindings as any[] });
};

export const getRows = async <T extends QueryResultRow>(
  promise: Promise<QueryResult<T>>,
) => {
  const { rows } = await promise;
  return rows;
};

export const getFirstRow = async <T extends QueryResultRow>(
  promise: Promise<QueryResult<T>>,
) => {
  const { rows } = await promise;
  return rows[0];
};

export const getRowsOfQuery = <T extends QueryResultRow>(
  queryable: Queryable,
  knexBuilder: QueryBuilder,
) => getRows(runKnex<T>(queryable, knexBuilder));

export const getFirstRowOfQuery = <T extends QueryResultRow>(
  queryable: Queryable,
  KnexBuilder: QueryBuilder,
) => getFirstRow(runKnex<T>(queryable, KnexBuilder));

export const assignWhereInParamsToQuery = (
  query: QueryBuilder,
  whereInParams: WhereInParamsType[],
) => {
  for (const inParamObj of whereInParams) {
    for (const property in inParamObj) {
      query = query.whereIn(property, inParamObj[property]);
    }
  }

  return query;
};

export const isUnsafeQuery = (sql: any) => {
  const sqlIgnoredCase = sql.toLowerCase();
  if (
    sqlIgnoredCase.indexOf('update ') > -1 ||
    sqlIgnoredCase.indexOf('insert ') > -1 ||
    sqlIgnoredCase.indexOf('drop ') > -1 ||
    sqlIgnoredCase.indexOf('create ') > -1 ||
    sqlIgnoredCase.indexOf(' set ') > -1 ||
    sqlIgnoredCase.indexOf('alter ') > -1 ||
    sqlIgnoredCase.indexOf('delete ') > -1
  ) {
    throw new HttpException('ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const parseExpiryToMs = (value: string): number => {
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) return 30 * 24 * 60 * 60 * 1000;

  const amount = Number(match[1]);
  const unit = match[2] as 's' | 'm' | 'h' | 'd';
  const multipliers: Record<typeof unit, number> = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  return amount * multipliers[unit];
};
