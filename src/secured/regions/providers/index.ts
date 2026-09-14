import { RegionsDao } from './regions.dao';
import { RegionsService } from './regions.service';
import { DistrictsDao } from '../modules/districts/providers/districts.dao';

export const RegionProviders = [
  { useClass: RegionsDao, provide: RegionsDao },
  { useClass: RegionsService, provide: RegionsService },
  { useClass: DistrictsDao, provide: DistrictsDao },
];
