import { GenericService } from 'src/core/generic.service';
import { PoolService } from 'src/core/pool.service';
import { DoctorWorkplacesModel } from '../../models/doctorWorkplaces.model';
import { DoctorWorkplacesDao } from './doctor-workplaces.dao';
import { Queryable } from '../../../../common/constants/constants';

export class DoctorWorkplacesService extends GenericService<DoctorWorkplacesModel> {
  constructor(
    protected readonly pool: PoolService,
    protected readonly dao: DoctorWorkplacesDao<DoctorWorkplacesModel>,
  ) {
    super(pool, dao);
  }

  findWorkplacesForDoctor(queryable: Queryable, doctorId: string) {
    return this.dao.findWorkplacesForDoctor(queryable, doctorId);
  }

  assign(queryable: Queryable, doctorId: string, workplaceId: string) {
    return this.dao.assign(queryable, doctorId, workplaceId);
  }

  unassign(queryable: Queryable, doctorId: string, workplaceId: string) {
    return this.dao.unassign(queryable, doctorId, workplaceId);
  }

  getDefaultColumns(): string[] | Record<string, any> {
    return ['*'];
  }
}
