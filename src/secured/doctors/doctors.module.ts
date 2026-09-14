import { Module } from '@nestjs/common';
import { DoctorsProviders } from './providers';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './providers/doctors.service';
import { DoctorWorkplacesModule } from './modules/doctorWorkplaces/doctor-workplaces.module';
import { DoctorSpecialtiesModule } from './modules/doctorSpecialties/doctor-specialties.module';
import { SpecialtiesModule } from '../specialties/specialties.module';
import { WorkplacesModule } from '../workplaces/workplaces.module';

@Module({
  imports: [
    SpecialtiesModule,
    DoctorSpecialtiesModule,
    WorkplacesModule,
    DoctorWorkplacesModule,
  ],
  controllers: [DoctorsController],
  providers: [...DoctorsProviders],
  exports: [DoctorsService],
})
export class DoctorsModule {}
