import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../core/base.dao';
import { tableNames, Queryable } from '../../common/constants/constants';
import { getRows, runKnex } from '../../utils';

@Injectable()
export class DistrictsDao extends BaseDao {
  constructor() {
    super(tableNames.districts);
  }

  findByRegion(queryable: Queryable, regionId: number) {
    const query = this.knex
      .select('*')
      .from(this.tableName)
      .where({ region_id: regionId })
      .orderBy('name', 'asc');

    return getRows(runKnex(queryable, query));
  }
}
