import { BaseService } from './base.service';
import { PoolService } from './pool.service';
import { BaseDao } from './base.dao';

export abstract class GenericService extends BaseService {
  protected constructor(
    protected readonly poolService: PoolService,
    protected readonly dao: BaseDao,
  ) {
    super(poolService, dao);
  }

  abstract getDefaultColumns(): string[] | Record<string, any>;
}
