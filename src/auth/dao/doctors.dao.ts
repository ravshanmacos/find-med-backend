import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../core/base.dao';
import { tableNames } from '../../common/constants/constants';

@Injectable()
export class DoctorsDao extends BaseDao {
  constructor() {
    super(tableNames.doctors);
  }
}
