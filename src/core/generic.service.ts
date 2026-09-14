import { BaseService } from './base.service';
import { PoolService } from './pool.service';
import { BaseDao } from './base.dao';
import { BaseType, UUID } from 'src/common/types';
import { HttpBadRequestException } from 'src/common/exceptions/http-bad-request-exceptions';
import { ERROR_MESSAGES } from 'src/common/messages/error-messages';
import { Queryable } from 'src/common/constants/constants';

export abstract class GenericService<
  T extends BaseType,
> extends BaseService<T> {
  protected constructor(
    protected readonly poolService: PoolService,
    protected readonly dao: BaseDao<T>,
  ) {
    super(poolService, dao);
  }

  abstract getDefaultColumns(): string[] | Record<string, any>;

  findOne(id: UUID) {
    return super.findOne(id);
  }

  async findOneByCondition(where: Record<string, any>, columns = ['*']) {
    const all = await super.findAll(where, columns);

    if (all?.length === 1) {
      return all[0];
    } else if (all?.length > 1) {
      throw new HttpBadRequestException(
        ERROR_MESSAGES.MULTIPLE_ROWS_FOUND_WHEN_ONE_ROW_REQUIRED,
      );
    } else return null;
  }

  async checkForExistById(id: UUID) {
    const item = await this.findOne(id);

    if (!item || !item?.id) {
      throw new HttpBadRequestException(ERROR_MESSAGES.NOT_FOUND);
    }

    return item;
  }

  async checkForExistByIdWithPool(pool: Queryable, id: UUID) {
    const item = await this.findOneWithPool(pool, id);

    if (!item || !item?.id) {
      throw new HttpBadRequestException(ERROR_MESSAGES.NOT_FOUND);
    }

    return item;
  }

  insert(values: Record<string, any>) {
    return super.insert(values);
  }

  update(values: Record<string, any>, where: Record<string, any>) {
    return super.update(values, where);
  }
}
