import { Module } from '@nestjs/common';
import { RegionsController } from './regions.controller';
import { RegionsService } from './providers/regions.service';
import { RegionProviders } from './providers';

@Module({
  controllers: [RegionsController],
  providers: [...RegionProviders],
  exports: [RegionsService],
})
export class RegionsModule {}
