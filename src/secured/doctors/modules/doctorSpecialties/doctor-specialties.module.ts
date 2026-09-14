import { Module } from '@nestjs/common';
import { DoctorSpecialtiesService } from './doctor-specialties.service';
import { DoctorSpecialtiesDao } from './doctor-specialties.dao';

@Module({
  imports: [],
  providers: [DoctorSpecialtiesService, DoctorSpecialtiesDao],
  exports: [DoctorSpecialtiesService],
})
export class DoctorSpecialtiesModule {}
