import { WorkplacesDao } from './workplaces.dao';
import { WorkplacesService } from './workplaces.service';

export const WorkplacesProviders = [
  { useClass: WorkplacesDao, provide: WorkplacesDao },
  { useClass: WorkplacesService, provide: WorkplacesService },
];
