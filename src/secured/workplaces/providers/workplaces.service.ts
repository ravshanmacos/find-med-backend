import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../../core/base.service';
import { PoolService } from '../../../core/pool.service';
import { wrapInTransaction } from '../../../utils';
import { ERROR_MESSAGES } from '../../../common/messages/error-messages';
import { WorkplaceException } from '../../../common/exceptions/workplace.exceptions';
import { WorkplacesDao } from './workplaces.dao';
import { CreateWorkplaceDto } from '../dto/create-workplace.dto';
import { UpdateWorkplaceDto } from '../dto/update-workplace.dto';

@Injectable()
export class WorkplacesService extends BaseService {
  constructor(
    poolService: PoolService,
    private readonly workplacesDao: WorkplacesDao,
  ) {
    super(poolService, workplacesDao);
  }

  search(
    search?: string,
    regionId?: number,
    districtId?: number,
    limit?: number,
    offset?: number,
  ) {
    return this.workplacesDao.searchByName(
      this.poolService.pool,
      search,
      regionId,
      districtId,
      limit,
      offset,
    );
  }

  create(dto: CreateWorkplaceDto) {
    return this.workplacesDao.insert(this.poolService.pool, {
      name: dto.name,
      address: dto.address ?? null,
      phone: dto.phone ?? null,
      region_id: dto.regionId ?? null,
      district_id: dto.districtId ?? null,
    });
  }

  updateOne(id: string, dto: UpdateWorkplaceDto) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const existing = await this.workplacesDao.findOne(client, id);

      if (!existing) {
        throw new WorkplaceException(
          ERROR_MESSAGES.WORKPLACE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const values: Record<string, any> = {};
      if (dto.name !== undefined) values.name = dto.name;
      if (dto.address !== undefined) values.address = dto.address;
      if (dto.phone !== undefined) values.phone = dto.phone;
      if (dto.regionId !== undefined) values.region_id = dto.regionId;
      if (dto.districtId !== undefined) values.district_id = dto.districtId;

      const [updated] = await this.workplacesDao.update(client, values, {
        id,
      });

      return updated;
    });
  }
}
