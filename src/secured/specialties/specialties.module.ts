import { Module } from '@nestjs/common';
import { PoolService } from '../../core/pool.service';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesService } from './providers/specialties.service';
import { SpecialtiesProviders } from './providers';

@Module({
  controllers: [SpecialtiesController],
  providers: [PoolService, ...SpecialtiesProviders],
  exports: [SpecialtiesService],
})
export class SpecialtiesModule {}
