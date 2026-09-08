import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base.service';
import { PoolService } from '../../core/pool.service';
import { ProductsDao } from './products.dao';

@Injectable()
export class ProductsService extends BaseService {
  constructor(poolService: PoolService, dao: ProductsDao) {
    super(poolService, dao);
  }
}
