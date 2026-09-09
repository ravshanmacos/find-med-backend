import { DoctorsDao } from './doctors.dao';
import { DoctorsService } from './doctors.service';
import { DoctorSpecialtiesDao } from './doctor-specialties.dao';
import { DoctorWorkplacesDao } from './doctor-workplaces.dao';

export const DoctorsProviders = [
  { useClass: DoctorsDao, provide: DoctorsDao },
  { useClass: DoctorsService, provide: DoctorsService },
  { useClass: DoctorSpecialtiesDao, provide: DoctorSpecialtiesDao },
  { useClass: DoctorWorkplacesDao, provide: DoctorWorkplacesDao },
];
