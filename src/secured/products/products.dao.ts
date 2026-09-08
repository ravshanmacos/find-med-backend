import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../core/base.dao';
import { tableNames } from '../../common/constants/constants';

@Injectable()
export class ProductsDao extends BaseDao {
  constructor() {
    super(tableNames.products);
  }
}
