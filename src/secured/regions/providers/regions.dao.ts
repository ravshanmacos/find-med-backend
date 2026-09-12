import { Injectable } from '@nestjs/common';
import { BaseDao } from 'src/core/base.dao';
import { tableNames } from 'src/common/constants/constants';

@Injectable()
export class RegionsDao extends BaseDao {
  constructor() {
    super(tableNames.regions);
  }
}
