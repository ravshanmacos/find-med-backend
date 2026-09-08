import { PatientsDao } from './patients.dao';
import { PatientsService } from './patients.service';

export const PatientsProviders = [
  { useClass: PatientsDao, provide: PatientsDao },
  { useClass: PatientsService, provide: PatientsService },
];
