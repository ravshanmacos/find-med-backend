import process from 'process';
import { Queryable, WhereInParamsType } from './common/constants/constants';
import { QueryBuilder } from './common/types';
import { Pool, PoolClient, QueryResult } from 'pg';
import { HttpException, HttpStatus } from '@nestjs/common';

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

export const runKnex = (
  queryable: Queryable,
  knexBuilder: QueryBuilder,
  request?: any,
) => {
  const { sql, bindings } = knexBuilder.toSQL().toNative();
  if (process.env.SQL_DEBUG == 'true') {
    console.log(`sql_debugger: ${knexBuilder.toQuery()}`);
  }
  return queryable.query({ text: sql, values: bindings as any[] });
};

export const getFirstRow = async (promise: Promise<QueryResult>) => {
  const { rows } = await promise;
  return rows[0];
};

export const getRows = async (promise: Promise<QueryResult>) => {
  const { rows } = await promise;
  return rows;
};

export const getRowsOfQuery = (
  queryable: Queryable,
  knexBuilder: QueryBuilder,
) => getRows(runKnex(queryable, knexBuilder));

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
