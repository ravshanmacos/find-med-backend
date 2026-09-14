import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../../core/base.dao';
import { tableNames, Queryable } from '../../../common/constants/constants';
import { getRows, runKnex } from '../../../utils';
import { QueryResultRow } from 'pg';

export class WorkplacesDao<T extends QueryResultRow> extends BaseDao<T> {
  constructor() {
    super(tableNames.workplaces);
  }

  // Partial name match (ILIKE) + optional region/district filters + pagination.
  searchByName(
    queryable: Queryable,
    search?: string,
    regionId?: number,
    districtId?: number,
    limit = 20,
    offset = 0,
  ) {
    let query = this.knex.select('*').from(this.tableName);

    if (search) {
      query = query.whereILike('name', `%${search}%`);
    }

    if (regionId) {
      query = query.where('region_id', regionId);
    }

    if (districtId) {
      query = query.where('district_id', districtId);
    }

    query = query.orderBy('name', 'asc').limit(limit).offset(offset);

    return getRows<T>(runKnex<T>(queryable, query));
  }
}
