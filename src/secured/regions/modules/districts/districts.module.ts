import { Module } from '@nestjs/common';
import { DistrictsService } from './providers/districts.service';
import { DistrictsDao } from './providers/districts.dao';

@Module({
  imports: [],
  providers: [DistrictsDao, DistrictsService],
  exports: [DistrictsService],
})
export class DistrictsModule {}
