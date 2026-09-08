import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../core/base.dao';
import { tableNames, Queryable } from '../../common/constants/constants';
import { getRows, runKnex } from '../../utils';

@Injectable()
export class DoctorSpecialtiesDao extends BaseDao {
  constructor() {
    super(tableNames.doctorSpecialties);
  }

  // Idempotent assignment — re-sending the same pair is not an error.
  assign(queryable: Queryable, doctorId: string, specialtyId: number) {
    const query = this.knex(this.tableName)
      .insert({ doctor_id: doctorId, specialty_id: specialtyId })
      .onConflict(['doctor_id', 'specialty_id'])
      .ignore();

    return runKnex(queryable, query);
  }

  unassign(queryable: Queryable, doctorId: string, specialtyId: number) {
    const query = this.knex(this.tableName)
      .where({ doctor_id: doctorId, specialty_id: specialtyId })
      .del();

    return runKnex(queryable, query);
  }

  // All specialties assigned to a doctor, as full objects (id + name).
  findSpecialtiesForDoctor(queryable: Queryable, doctorId: string) {
    const query = this.knex
      .select('specialties.id', 'specialties.name')
      .from(this.tableName)
      .join('specialties', 'specialties.id', `${this.tableName}.specialty_id`)
      .where(`${this.tableName}.doctor_id`, doctorId)
      .orderBy('specialties.name', 'asc');

    return getRows(runKnex(queryable, query));
  }
}
