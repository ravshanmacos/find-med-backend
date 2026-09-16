import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../core/base.dao';
import { CommonCronService } from '../models/cron.model';
import {
  CronNames,
  Queryable,
  tableNames,
} from '../../common/constants/constants';
import { getFirstRowOfQuery, getRowsOfQuery } from 'src/utils';

@Injectable()
export class CronDao extends BaseDao<CommonCronService> {
  constructor() {
    super(tableNames.cron);
  }

  async findByName(client: Queryable, name: CronNames) {
    const { knex } = this;
    const query = knex.select['*']
      .from(`${tableNames.cron} as c`)
      .where({ 'c.name': name });

    return getRowsOfQuery<CommonCronService>(client, query);
  }

  async deleteByName(client: Queryable, name: CronNames) {
    const { knex } = this;
    const query = knex.select['*']
      .from(this.tableName)
      .where({ name })
      .returning('*');
    return getFirstRowOfQuery<CommonCronService>(client, query);
  }
}
