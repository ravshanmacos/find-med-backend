import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base.service';
import { PoolService } from '../../core/pool.service';
import { RegionsDao } from './regions.dao';
import { DistrictsDao } from './districts.dao';

@Injectable()
export class RegionsService extends BaseService {
  constructor(
    poolService: PoolService,
    private readonly regionsDao: RegionsDao,
    private readonly districtsDao: DistrictsDao,
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
    return this.districtsDao.findByRegion(this.poolService.pool, regionId);
  }
}
