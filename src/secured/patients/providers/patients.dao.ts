import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { BaseDao } from 'src/core/base.dao';
import { tableNames } from 'src/common/constants/constants';

@Injectable()
export class PatientsDao<T extends QueryResultRow> extends BaseDao<T> {
  constructor() {
    super(tableNames.patients);
  }
}
