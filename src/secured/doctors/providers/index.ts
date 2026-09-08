import { DoctorsDao } from './doctors.dao';
import { DoctorsService } from './doctors.service';

export const DoctorsProviders = [
  { useClass: DoctorsDao, provide: DoctorsDao },
  { useClass: DoctorsService, provide: DoctorsService },
];
