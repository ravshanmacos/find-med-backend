import { GenericService } from 'src/core/generic.service';
import { DoctorSpecialtiesModel } from '../../models/doctorSpecialties.model';
import { PoolService } from 'src/core/pool.service';
import { DoctorSpecialtiesDao } from './doctor-specialties.dao';
import { Queryable } from 'src/common/constants/constants';
import { UUID } from 'src/common/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DoctorSpecialtiesService extends GenericService<DoctorSpecialtiesModel> {
  constructor(
    protected readonly pool: PoolService,
    protected readonly dao: DoctorSpecialtiesDao<DoctorSpecialtiesModel>,
  ) {
    super(pool, dao);
  }

  findSpecialtiesForDoctor(queryable: Queryable, doctorId: UUID) {
    return this.dao.findSpecialtiesForDoctor(queryable, doctorId);
  }

  assign(queryable: Queryable, doctorId: UUID, specialtyId: UUID) {
    return this.dao.assign(queryable, doctorId, specialtyId);
  }

  unassign(queryable: Queryable, doctorId: UUID, specialtyId: UUID) {
    return this.dao.unassign(queryable, doctorId, specialtyId);
  }

  getDefaultColumns(): string[] | Record<string, any> {
    return ['*'];
  }
}
