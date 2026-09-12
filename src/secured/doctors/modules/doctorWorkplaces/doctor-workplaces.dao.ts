import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../../../core/base.dao';
import { tableNames, Queryable } from '../../../../common/constants/constants';
import { getRows, runKnex } from '../../../../utils';
import { QueryResultRow } from 'pg';

@Injectable()
export class DoctorWorkplacesDao<T extends QueryResultRow> extends BaseDao<T> {
  constructor() {
    super(tableNames.doctorWorkplaces);
  }

  // Idempotent assignment — re-sending the same pair is not an error.
  assign(queryable: Queryable, doctorId: string, workplaceId: string) {
    const query = this.knex(this.tableName)
      .insert({ doctor_id: doctorId, workplace_id: workplaceId })
      .onConflict(['doctor_id', 'workplace_id'])
      .ignore();

    return runKnex(queryable, query);
  }

  unassign(queryable: Queryable, doctorId: string, workplaceId: string) {
    const query = this.knex(this.tableName)
      .where({ doctor_id: doctorId, workplace_id: workplaceId })
      .del();

    return runKnex<T>(queryable, query);
  }

  // All workplaces assigned to a doctor, as full objects.
  findWorkplacesForDoctor(queryable: Queryable, doctorId: string) {
    const query = this.knex
      .select(
        'workplaces.id',
        'workplaces.name',
        'workplaces.address',
        'workplaces.phone',
      )
      .from(this.tableName)
      .join('workplaces', 'workplaces.id', `${this.tableName}.workplace_id`)
      .where(`${this.tableName}.doctor_id`, doctorId)
      .orderBy('workplaces.name', 'asc');

    return getRows<T>(runKnex<T>(queryable, query));
  }
}
