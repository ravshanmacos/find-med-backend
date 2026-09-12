import { BaseDao } from './base.dao';
import { PoolService } from './pool.service';
import { Queryable } from '../common/constants/constants';
import { wrapInTransaction } from '../utils';
import { Columns, UUID, WhereCondition } from '../common/types';
import { QueryResultRow } from 'pg';

export class BaseService<T extends QueryResultRow> {
  constructor(
    protected readonly poolService: PoolService,
    protected readonly dao: BaseDao<T>,
  ) {}

  findAll(where: Record<string, any>, columns?: string[]) {
    return this.dao.findAll(this.poolService.pool, where, columns);
  }

  findAllWithPool(
    queryable: Queryable,
    where: Record<string, any>,
    columns?: string[],
  ) {
    return wrapInTransaction(this.poolService.pool, (poolClient) => {
      return this.dao.findAll(poolClient, where, columns);
    });
  }

  findOne(id: string | number, columns?: string[]) {
    return wrapInTransaction(this.poolService.pool, (poolClient) => {
      return this.dao.findOne(poolClient, id, columns);
    });
  }

  findOneBy(queryable: Queryable, where: WhereCondition, columns?: Columns) {
    return this.dao.findOneBy(queryable, where, columns);
  }

  findOneByIdAndSigner(id: string, signer_id: string, columns?: string[]) {
    return wrapInTransaction(this.poolService.pool, (poolClient) => {
      return this.dao.findOneBy(poolClient, { id, signer_id }, columns);
    });
  }

  findOneByLatest(
    queryable: Queryable,
    where: WhereCondition,
    columns?: Columns,
  ) {
    return this.dao.findOneByLatest(queryable, where, columns);
  }

  findOneWithPool(pool: Queryable, id: UUID | number, columns?: string[]) {
    return this.dao.findOne(pool, id, columns);
  }

  insert(values: Record<string, any>) {
    return wrapInTransaction(this.poolService.pool, (poolClient) => {
      return this.dao.insert(poolClient, values);
    });
  }

  insertWithPool(pool: Queryable, values: Record<string, any>) {
    return this.dao.insert(pool, values);
  }

  update(values: Record<string, any>, where: Record<string, any>) {
    return wrapInTransaction(this.poolService.pool, (poolClient) => {
      return this.dao.update(poolClient, values, where);
    });
  }

  delete(where: Record<string, any>) {
    return wrapInTransaction(this.poolService.pool, (poolClient) => {
      return this.dao.delete(poolClient, where);
    });
  }

  getAllByIds(ids: any[], client: Queryable = this.poolService.pool) {
    return this.dao.findAllByIds(client, ids);
  }

  updateWithPool(
    pool: Queryable,
    values: Record<string, any>,
    where: Record<string, any>,
  ) {
    return this.dao.update(pool, values, where);
  }

  // updateByNotInIds(
  //   values: Record<string, any>,
  //   ids: UUID[],
  //   where: Record<string, any>,
  // ) {
  //   return wrapInTransaction(this.poolService.pool, (poolClient) => {
  //     return this.dao.updateByIdsNotIn(poolClient, values, ids, where);
  //   });
  // }

  updateByIds(values: Record<string, any>, ids: UUID[]) {
    return wrapInTransaction(this.poolService.pool, (poolClient) => {
      return this.dao.updateByIds(poolClient, values, ids);
    });
  }

  updateByIdsWithPool(
    client: Queryable,
    values: Record<string, any>,
    ids: UUID[],
  ) {
    return this.dao.updateByIds(client, values, ids);
  }

  findPage(
    options: {
      where?: Record<string, any>;
      columns?: string[] | Record<string, any>;
      limit?: number;
      offset?: number;
      asc?: boolean;
      sort?: string;
    } = {},
  ) {
    return wrapInTransaction(this.poolService.pool, (client) =>
      Promise.all([
        this.dao.findAllLimit(client, options),
        this.dao.count(client, options.where),
      ]),
    );
  }
}
