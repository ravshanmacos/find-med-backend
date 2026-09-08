import { Module } from '@nestjs/common';
import { PoolService } from '../../core/pool.service';
import { PatientsController } from './patients.controller';
import { PatientsService } from './providers/patients.service';
import { PatientsProviders } from './providers';

@Module({
  controllers: [PatientsController],
  providers: [PoolService, ...PatientsProviders],
  exports: [PatientsService],
})
export class PatientsModule {}
