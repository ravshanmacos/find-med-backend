import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../../core/base.dao';
import { tableNames, Queryable } from '../../../common/constants/constants';
import { getRows, runKnex } from '../../../utils';

@Injectable()
export class WorkplacesDao extends BaseDao {
  constructor() {
    super(tableNames.workplaces);
  }

  // Partial name match (ILIKE) + pagination.
  searchByName(
    queryable: Queryable,
    search?: string,
    limit = 20,
    offset = 0,
  ) {
    let query = this.knex.select('*').from(this.tableName);

    if (search) {
      query = query.whereILike('name', `%${search}%`);
    }

    query = query.orderBy('name', 'asc').limit(limit).offset(offset);

    return getRows(runKnex(queryable, query));
  }
}
