import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../../core/base.service';
import { PoolService } from '../../../core/pool.service';
import { wrapInTransaction } from '../../../utils';
import { ERROR_MESSAGES } from '../../../common/messages/error-messages';
import { WorkplaceException } from '../../../common/exceptions/workplace.exceptions';
import { WorkplacesDao } from './workplaces.dao';
import { CreateWorkplaceDto } from '../dto/create-workplace.dto';
import { UpdateWorkplaceDto } from '../dto/update-workplace.dto';
import { GenericService } from '../../../core/generic.service';
import { Workplace } from '../model/workplace.model';

@Injectable()
export class WorkplacesService extends GenericService<Workplace> {
  constructor(
    poolService: PoolService,
    private readonly workplacesDao: WorkplacesDao<Workplace>,
  ) {
    super(poolService, workplacesDao);
  }

  getDefaultColumns(): string[] | Record<string, any> {
    throw new Error('Method not implemented.');
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
      await this.checkForExistByIdWithPool(client, id);

      const values: Record<string, any> = {};
      if (dto.name !== undefined) values.name = dto.name;
      if (dto.address !== undefined) values.address = dto.address;
      if (dto.phone !== undefined) values.phone = dto.phone;
      if (dto.regionId !== undefined) values.region_id = dto.regionId;
      if (dto.districtId !== undefined) values.district_id = dto.districtId;

      const [updated] = await this.update(values, {
        id,
      });

      return updated;
    });
  }
}
