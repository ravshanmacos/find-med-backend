import { Injectable } from '@nestjs/common';
import { BaseDao } from 'src/core/base.dao';
import { tableNames, Queryable } from 'src/common/constants/constants';
import { getRows, runKnex } from 'src/utils';
import { QueryResultRow } from 'pg';
import { UUID } from 'src/common/types';

@Injectable()
export class DoctorSpecialtiesDao<T extends QueryResultRow> extends BaseDao<T> {
  constructor() {
    super(tableNames.doctorSpecialties);
  }

  // Idempotent assignment — re-sending the same pair is not an error.
  assign(queryable: Queryable, doctorId: UUID, specialtyId: number) {
    const query = this.knex(this.tableName)
      .insert({ doctor_id: doctorId, specialty_id: specialtyId })
      .onConflict(['doctor_id', 'specialty_id'])
      .ignore();

    return runKnex<T>(queryable, query);
  }

  unassign(queryable: Queryable, doctorId: UUID, specialtyId: number) {
    const query = this.knex(this.tableName)
      .where({ doctor_id: doctorId, specialty_id: specialtyId })
      .del();

    return runKnex<T>(queryable, query);
  }

  // All specialties assigned to a doctor, as full objects (id + name).
  findSpecialtiesForDoctor(queryable: Queryable, doctorId: UUID) {
    const query = this.knex
      .select('specialties.id', 'specialties.name')
      .from(this.tableName)
      .join('specialties', 'specialties.id', `${this.tableName}.specialty_id`)
      .where(`${this.tableName}.doctor_id`, doctorId)
      .orderBy('specialties.name', 'asc');

    return getRows<T>(runKnex<T>(queryable, query));
  }
}
