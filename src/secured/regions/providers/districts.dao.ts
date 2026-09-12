import { Injectable } from '@nestjs/common';
import { BaseDao } from 'src/core/base.dao';
import { tableNames, Queryable } from 'src/common/constants/constants';
import { getRows, runKnex } from 'src/utils';

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
