import { Module } from '@nestjs/common';
import { PoolService } from '../../core/pool.service';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesService } from './specialties.service';
import { SpecialtiesDao } from './specialties.dao';

@Module({
  controllers: [SpecialtiesController],
  providers: [PoolService, SpecialtiesDao, SpecialtiesService],
  exports: [SpecialtiesService],
})
export class SpecialtiesModule {}
