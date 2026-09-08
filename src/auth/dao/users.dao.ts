import { Injectable } from '@nestjs/common';
import { BaseDao } from '../../core/base.dao';
import { tableNames } from '../../common/constants/constants';

@Injectable()
export class UsersDao extends BaseDao {
  constructor() {
    super(tableNames.users);
  }
}
