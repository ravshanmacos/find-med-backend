import { Module } from '@nestjs/common';
import { PoolService } from '../../core/pool.service';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { DoctorsDao } from './doctors.dao';

@Module({
  controllers: [DoctorsController],
  providers: [PoolService, DoctorsDao, DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
