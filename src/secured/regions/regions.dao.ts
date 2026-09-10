import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../core/base.dao';
import { tableNames } from '../../common/constants/constants';

@Injectable()
export class RegionsDao extends BaseDao {
  constructor() {
    super(tableNames.regions);
  }
}
