import { Module } from '@nestjs/common';
import { PoolService } from '../../core/pool.service';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './providers/doctors.service';
import { SpecialtiesDao } from '../specialties/providers/specialties.dao';
import { DoctorSpecialtiesDao } from '../specialties/providers/doctor-specialties.dao';
import { DoctorsProviders } from './providers';

@Module({
  controllers: [DoctorsController],
  providers: [
    PoolService,
    SpecialtiesDao,
    DoctorSpecialtiesDao,
    ...DoctorsProviders,
  ],
  exports: [DoctorsService],
})
export class DoctorsModule {}
