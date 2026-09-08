import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base.service';
import { PoolService } from '../../core/pool.service';
import { PatientsDao } from './patients.dao';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService extends BaseService {
  constructor(
    poolService: PoolService,
    private readonly patientsDao: PatientsDao,
  ) {
    super(poolService, patientsDao);
  }

  findByUserId(userId: string) {
    return this.findOneBy(this.poolService.pool, { user_id: userId });
  }

  async updateOwn(userId: string, dto: UpdatePatientDto) {
    const values: Record<string, any> = {};
    if (dto.fullName !== undefined) values.full_name = dto.fullName;
    if (dto.birthDate !== undefined) values.birth_date = dto.birthDate;
    if (dto.gender !== undefined) values.gender = dto.gender;

    const [updated] = await this.update(values, { user_id: userId });
    return updated;
  }
}
