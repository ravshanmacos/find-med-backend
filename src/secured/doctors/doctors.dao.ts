import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../core/base.dao';
import { tableNames, Queryable } from '../../common/constants/constants';
import { getRows, runKnex } from '../../utils';

@Injectable()
export class DoctorsDao extends BaseDao {
  constructor() {
    super(tableNames.doctors);
  }

  // Partial name match (ILIKE) + pagination. Returns all doctors if search is omitted.
  searchByName(
    queryable: Queryable,
    search?: string,
    limit = 20,
    offset = 0,
  ) {
    let query = this.knex.select('*').from(this.tableName);

    if (search) {
      query = query.whereILike('full_name', `%${search}%`);
    }

    query = query.orderBy('full_name', 'asc').limit(limit).offset(offset);

    return getRows(runKnex(queryable, query));
  }
}
