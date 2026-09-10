import { Module } from '@nestjs/common';
import { RegionsController } from './regions.controller';
import { RegionsService } from './regions.service';
import { RegionsDao } from './regions.dao';
import { DistrictsDao } from './districts.dao';

@Module({
  controllers: [RegionsController],
  providers: [RegionsDao, DistrictsDao, RegionsService],
  exports: [RegionsService],
})
export class RegionsModule {}
