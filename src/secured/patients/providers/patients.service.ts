import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../core/base.service';
import { PoolService } from '../../../core/pool.service';
import { PatientsDao } from './patients.dao';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { GenericService } from '../../../core/generic.service';
import { Patient } from '../models/patient.model';
import { UUID } from '../../../common/types';

@Injectable()
export class PatientsService extends GenericService<Patient> {
  constructor(
    protected readonly poolService: PoolService,
    protected readonly dao: PatientsDao<Patient>,
  ) {
    super(poolService, dao);
  }

  findByUserId(userId: UUID) {
    return this.findOneBy(this.poolService.pool, { user_id: userId });
  }

  async updateOwn(userId: UUID, dto: UpdatePatientDto) {
    const values: Record<string, any> = {};
    if (dto.fullName !== undefined) values.full_name = dto.fullName;
    if (dto.birthDate !== undefined) values.birth_date = dto.birthDate;
    if (dto.gender !== undefined) values.gender = dto.gender;

    const [updated] = await this.update(values, { user_id: userId });
    return updated;
  }

  getDefaultColumns(): string[] | Record<string, any> {
    return ['*'];
  }
}
