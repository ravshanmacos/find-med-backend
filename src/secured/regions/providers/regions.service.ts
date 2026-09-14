import { Injectable } from '@nestjs/common';
import { PoolService } from 'src/core/pool.service';
import { GenericService } from 'src/core/generic.service';
import { RegionsDao } from './regions.dao';
import { Region } from '../models/region.model';
import { DistrictsService } from '../modules/districts/providers/districts.service';

@Injectable()
export class RegionsService extends GenericService<Region> {
  constructor(
    poolService: PoolService,
    private readonly regionsDao: RegionsDao<Region>,
    private readonly districtsService: DistrictsService,
  ) {
    super(poolService, regionsDao);
  }

  list() {
    return this.regionsDao.findAll(this.poolService.pool, undefined, [
      'id',
      'name',
    ]);
  }

  districtsByRegion(regionId: number) {
    return this.districtsService.findByRegion(this.poolService.pool, regionId);
  }

  getDefaultColumns(): string[] | Record<string, any> {
    return ['*'];
  }
}
