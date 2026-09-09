import { Module } from '@nestjs/common';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './providers/doctors.service';
import { SpecialtiesDao } from '../specialties/providers/specialties.dao';
import { WorkplacesDao } from '../workplaces/providers/workplaces.dao';
import { DoctorsProviders } from './providers';

@Module({
  controllers: [DoctorsController],
  providers: [SpecialtiesDao, WorkplacesDao, ...DoctorsProviders],
  exports: [DoctorsService],
})
export class DoctorsModule {}
