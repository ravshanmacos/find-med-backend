import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../core/base.dao';
import { Queryable, tableNames } from '../../common/constants/constants';
import { getFirstRow, runKnex } from '../../utils';

@Injectable()
export class DoctorInvitesDao extends BaseDao {
  constructor() {
    super(tableNames.doctorInvites);
  }

  // Finds an invite with used_at NULL and expires_at still in the future.
  findValidByHash(queryable: Queryable, tokenHash: string) {
    const query = this.knex
      .select('*')
      .from(this.tableName)
      .where({ token_hash: tokenHash })
      .whereNull('used_at')
      .andWhere('expires_at', '>', this.knex.fn.now());

    return getFirstRow(runKnex(queryable, query));
  }
}
