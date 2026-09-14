import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../../core/base.dao';
import { tableNames } from '../../../common/constants/constants';
import { QueryResultRow } from 'pg';

@Injectable()
export class SpecialtiesDao<T extends QueryResultRow> extends BaseDao<T> {
  constructor() {
    super(tableNames.specialties);
  }
}
