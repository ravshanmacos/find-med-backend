import Knex from 'knex';
import {
  Columns,
  QueryBuilder,
  UUID,
  Values,
  WhereCondition,
} from '../common/types';
import {
  assignWhereInParamsToQuery,
  getFirstRow,
  getRowsOfQuery,
  getRows,
  runKnex,
} from '../utils';
import {
  Queryable,
  tableNames,
  WhereInParamsType,
} from '../common/constants/constants';
import { ERROR_MESSAGES } from '../common/messages/error-messages';
import { knexConfig } from '../../knexfile';
import { SQLException } from '../common/exceptions/sql.exceptions';
import { QueryResultRow } from 'pg';

export const knex = Knex(knexConfig);
export const migrate = async (): Promise<any> => {
  return Knex(knexConfig).migrate.latest();
};

export const seed = async (): Promise<any> => {
  return Knex(knexConfig).seed.run();
};

interface BaseDaoFields {
  whereInParams: WhereInParamsType[] | null;
}

export class BaseDao<T extends QueryResultRow> implements BaseDaoFields {
  public knex = knex;
  whereInParams: WhereInParamsType[] | null = null;

  constructor(protected readonly tableName: string) {
    this.knex = knex;
  }

  getDefaultColumns() {
    return ['*'];
  }

  private validateColumnName(columnName?: string): void {
    if (!columnName) return;

    // Check for valid column name format: table.column or column (alphanumeric, dots, underscores)
    const validColumnPattern = /^[a-zA-Z0-9_.]+$/;
    if (!validColumnPattern.test(columnName)) {
      throw new Error(
        `Invalid column name for ordering: "${columnName}". ` +
          `Column names must contain only alphanumeric characters, dots, and underscores.`,
      );
    }

    // Check for dangerous SQL keywords
    const dangerousKeywords = [
      'DROP',
      'DELETE',
      'INSERT',
      'UPDATE',
      'CREATE',
      'ALTER',
      'EXEC',
      'EXECUTE',
      ';',
      '--',
      '/*',
      '*/',
      'UNION',
      'SELECT',
    ];
    const upperColumnName = columnName.toUpperCase();
    for (const keyword of dangerousKeywords) {
      if (upperColumnName.includes(keyword)) {
        throw new Error(
          `Invalid column name for ordering: "${columnName}". ` +
            `SQL keywords are not allowed in column names.`,
        );
      }
    }
  }

  _addWhere(query: QueryBuilder, where: WhereCondition): QueryBuilder {
    if (where) {
      this.knex.select();
      if (typeof where == 'string') {
        // Security fix: Never accept raw string where clauses to prevent SQL injection
        throw new Error(
          'String-based where clauses are not supported for security reasons. ' +
            'Use object syntax instead: { column: value }',
        );
      } else query.where(where);
    }
    if (this.whereInParams) {
      query = assignWhereInParamsToQuery(query, this.whereInParams);
    }
    return query;
  }

  async count(queryable: Queryable, where?: WhereCondition): Promise<any> {
    let query = this.knex
      .select(this.knex.raw('count(*) as count'))
      .from(this.tableName);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (where) query = this._addWhere(query, where);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { count } = await getFirstRow(runKnex(queryable, query));
    return count;
  }

  findAll(
    queryable: Queryable,
    where?: WhereCondition,
    columns?: Columns,
    orderBy?: { column?: string; asc?: boolean },
    limit?: number,
    offset?: number,
  ) {
    const _columns = columns || this.getDefaultColumns();

    let query = this.knex.select(_columns).from(this.tableName);

    if (where) query = this._addWhere(query, where);

    if (orderBy) {
      this.validateColumnName(orderBy.column);
      if (orderBy && orderBy.column)
        query = query.orderBy(orderBy.column, orderBy.asc ? 'asc' : 'desc');
    }
    if (limit) {
      query.limit(limit);
    }

    if (offset) {
      query.offset(offset);
    }

    return getRows<T>(runKnex<T>(queryable, query));
  }

  findAllByIds(queryable: Queryable, ids: UUID[], columns?: Columns) {
    const _columns = columns || this.getDefaultColumns();
    const query = this.knex
      .select(_columns)
      .from(this.tableName)
      .whereIn('id', ids);
    return getRows(runKnex(queryable, query));
  }

  findAllLimit(
    queryable: Queryable,
    options: {
      where?: WhereCondition;
      columns?: string[] | Record<string, any>;
      limit?: number;
      offset?: number;
      asc?: boolean;
      sort?: string;
    } = {},
  ): any {
    const _columns = options.columns || this.getDefaultColumns();

    let query = this.knex.select(_columns).from(this.tableName);
    if (options.where) query = this._addWhere(query, options.where);

    if (options?.limit) query.limit(options.limit);

    if (options?.offset) query.offset(options.offset);

    if (options?.sort) {
      // Security fix: Validate column name to prevent SQL injection
      this.validateColumnName(options.sort);
      query = query.orderBy(options.sort, options.asc ? 'asc' : 'desc');
    }

    if (options?.limit == 1) return getFirstRow(runKnex(queryable, query));

    return getRows(runKnex(queryable, query));
  }

  async findOne(
    queryable: Queryable,
    id: any,
    columns?: Columns,
    request?: any,
  ) {
    const _columns = columns || this.getDefaultColumns();
    const query = this.knex.select(_columns).from(this.tableName).where({ id });
    return await getFirstRow<T>(runKnex<T>(queryable, query, request));
  }

  // async findOneAdmin(queryable: Queryable, columns?: Columns, request?: any) {
  //   const _columns = columns || this.getDefaultColumns();
  //
  //   const query = this.knex
  //     .select('u.*')
  //     .from({ u: 'users' })
  //     .join({ ur: tableNames.schemas.admin.users_roles }, 'ur.user_id', 'u.id')
  //     .join(
  //       { rp: tableNames.schemas.admin.role_permissions },
  //       'rp.role_id',
  //       'ur.role_id',
  //     )
  //     .where('rp.permission', 'ADMIN')
  //     .orderBy('u.created_at', 'desc')
  //     .limit(1);
  //
  //   return await getFirstRow(runKnex(queryable, query, request));
  // }

  async findOneBy(
    queryable: Queryable,
    where: WhereCondition,
    columns?: Columns,
  ) {
    const _columns = columns || this.getDefaultColumns();

    let query = this.knex.select(_columns).from(this.tableName);
    if (where) query = this._addWhere(query, where);

    return await getFirstRow(runKnex(queryable, query));
  }

  async findOneByLatest(
    queryable: Queryable,
    where: WhereCondition,
    columns?: Columns,
  ) {
    const _columns = columns || this.getDefaultColumns();

    let query = this.knex
      .select(_columns)
      .from(this.tableName)
      .orderBy('id', 'desc');
    if (where) query = this._addWhere(query, where);

    return await getFirstRow(runKnex(queryable, query));
  }

  insert(queryable: Queryable, values: Values) {
    const query = knex.insert(values).into(this.tableName).returning('*');
    return getFirstRow<T>(runKnex<T>(queryable, query));
  }

  insertWithoutId(queryable: Queryable, values: Values) {
    return getFirstRow(
      runKnex(
        queryable,
        knex.insert(values).into(this.tableName).returning('*'),
      ),
    );
  }

  insertAll(queryable: Queryable, values: Values) {
    const query = knex.insert(values).into(this.tableName).returning('*');

    return getRows(runKnex(queryable, query));
  }

  async update(queryable: Queryable, values: Values, where: WhereCondition) {
    if (!where || !Object.keys(where).length) {
      throw new SQLException(ERROR_MESSAGES.UNSAFE_SQL);
    }
    let query = knex.update(values).from(this.tableName).returning('*');
    if (where) query = this._addWhere(query, where);
    return getRows<T>(runKnex<T>(queryable, query));
  }

  async updateByIds(queryable: Queryable, values: Values, ids: UUID[]) {
    if (!ids?.length) throw new Error('ids list must not be empty');
    return getRows(
      runKnex(
        queryable,
        knex
          .update(values)
          .from(this.tableName)
          .whereIn('id', ids)
          .returning('*'),
      ),
    );
  }

  async delete(queryable: Queryable, where: Record<string, any>) {
    if (!where || !Object.keys(where).length) {
      throw new SQLException(ERROR_MESSAGES.UNSAFE_SQL);
    }
    return getRows(
      runKnex(
        queryable,
        knex.delete().from(this.tableName).where(where).returning('*'),
      ),
    );
  }

  // async expireUserSessions(session_id: string) {
  //   return await this.knex('sessions as s')
  //     .update({
  //       expire_date: new Date(),
  //       is_deleted: true,
  //       deleted_at: new Date(),
  //     })
  //     .where('id', session_id);
  // }

  getPageOfQuery(
    queryable: Queryable,
    query,
    defaultSort,
    options: {
      limit?: number;
      offset?: number;
      asc?: boolean;
      sort?: string;
    } = {},
  ): any {
    if (options.limit) {
      query.limit(options.limit);
    }
    if (options.offset) {
      query.offset(options.offset);
    }
    if (options.sort) {
      query.orderBy(
        `${
          options.sort && options.sort != 'created_at' //created_at can be ambiguous, therefore using defaultSort
            ? options.sort
            : defaultSort
        }`,
        options.asc ? 'asc' : 'desc',
      );
    }
    return getRowsOfQuery(queryable, query);
  }

  findAllByCondition(
    queryable: Queryable,
    where?: WhereCondition,
    whereRaw?: string,
    whereIn?: { columnName: string; values: string[] },
    whereNotIn?: { columnName: string; values: string[] },
    columns?: Columns,
    orderBy?: { column?: string; asc?: boolean },
  ) {
    const _columns = columns || this.getDefaultColumns();

    let query = this.knex.select(_columns).from(this.tableName);
    if (where) query = this._addWhere(query, where);
    if (whereRaw?.length) query = query.andWhereRaw(whereRaw);
    if (whereIn) query = query.whereIn(whereIn.columnName, whereIn.values);
    if (whereNotIn)
      query = query.whereNotIn(whereNotIn.columnName, whereNotIn.values);
    if (orderBy && orderBy.column) {
      query = query.orderBy(orderBy.column, orderBy.asc ? 'asc' : 'desc');
    }

    return getRows(runKnex(queryable, query));
  }
}
