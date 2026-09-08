import { Module } from '@nestjs/common';
import { PoolService } from '../../core/pool.service';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { PatientsDao } from './patients.dao';

@Module({
  controllers: [PatientsController],
  providers: [PoolService, PatientsDao, PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
