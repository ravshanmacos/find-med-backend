import { Module } from '@nestjs/common';
import { DoctorWorkplacesService } from './doctor-workplaces.service';
import { DoctorWorkplacesDao } from './doctor-workplaces.dao';

@Module({
  imports: [],
  providers: [DoctorWorkplacesService, DoctorWorkplacesDao],
  exports: [DoctorWorkplacesService],
})
export class DoctorWorkplacesModule {}
