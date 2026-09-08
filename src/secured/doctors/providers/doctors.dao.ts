import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../../core/base.dao';
import { tableNames, Queryable } from '../../../common/constants/constants';
import { getRows, runKnex } from '../../../utils';

@Injectable()
export class DoctorsDao extends BaseDao {
  constructor() {
    super(tableNames.doctors);
  }

  // Partial name match (ILIKE) + optional specialty filter + pagination.
  searchByName(
    queryable: Queryable,
    search?: string,
    specialtyId?: number,
    limit = 20,
    offset = 0,
  ) {
    let query = this.knex.select(`${this.tableName}.*`).from(this.tableName);

    if (specialtyId) {
      query = query
        .join(
          tableNames.doctorSpecialties,
          `${tableNames.doctorSpecialties}.doctor_id`,
          `${this.tableName}.id`,
        )
        .where(`${tableNames.doctorSpecialties}.specialty_id`, specialtyId);
    }

    if (search) {
      query = query.whereILike(`${this.tableName}.full_name`, `%${search}%`);
    }

    query = query
      .orderBy(`${this.tableName}.full_name`, 'asc')
      .limit(limit)
      .offset(offset);

    return getRows(runKnex(queryable, query));
  }
}
