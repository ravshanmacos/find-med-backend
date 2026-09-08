import { SpecialtiesDao } from './specialties.dao';
import { SpecialtiesService } from './specialties.service';

export const SpecialtiesProviders = [
  { useClass: SpecialtiesDao, provide: SpecialtiesDao },
  { useClass: SpecialtiesService, provide: SpecialtiesService },
];
