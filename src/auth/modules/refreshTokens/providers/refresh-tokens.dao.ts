import { Injectable } from '@nestjs/common';
import { BaseDao } from 'src/core/base.dao';
import { Queryable, tableNames } from 'src/common/constants/constants';
import { getFirstRow, runKnex } from 'src/utils';
import { QueryResultRow } from 'pg';

@Injectable()
export class RefreshTokensDao<T extends QueryResultRow> extends BaseDao<T> {
  constructor() {
    super(tableNames.refreshTokens);
  }

  // Finds a token with revoked_at NULL and expires_at still in the future.
  findValidByHash(queryable: Queryable, tokenHash: string) {
    const query = this.knex
      .select('*')
      .from(this.tableName)
      .where({ token_hash: tokenHash })
      .whereNull('revoked_at')
      .andWhere('expires_at', '>', this.knex.fn.now());

    return getFirstRow<T>(runKnex<T>(queryable, query));
  }
}
