import { Module } from '@nestjs/common';
import { PoolService } from '../../core/pool.service';
import { ProductsDao } from './products.dao';
import { ProductsService } from './products.service';

@Module({
  providers: [PoolService, ProductsDao, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
