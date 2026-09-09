import { WorkplacesDao } from './workplaces.dao';
import { DoctorWorkplacesDao } from './doctor-workplaces.dao';
import { WorkplacesService } from './workplaces.service';

export const WorkplacesProviders = [
  { useClass: WorkplacesDao, provide: WorkplacesDao },
  { useClass: DoctorWorkplacesDao, provide: DoctorWorkplacesDao },
  { useClass: WorkplacesService, provide: WorkplacesService },
];
