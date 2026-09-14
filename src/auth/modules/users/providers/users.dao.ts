import { Injectable } from '@nestjs/common';
import { BaseDao } from 'src/core/base.dao';
import { tableNames } from 'src/common/constants/constants';
import { QueryResultRow } from 'pg';

@Injectable()
export class UsersDao<T extends QueryResultRow> extends BaseDao<T> {
  constructor() {
    super(tableNames.users);
  }
}
