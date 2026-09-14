import { GenericService } from 'src/core/generic.service';
import { PoolService } from 'src/core/pool.service';
import { UsersDao } from './users.dao';
import { RegisterRequest, LoginRequest, User } from '../models/user.model';
import { wrapInTransaction } from 'src/utils';
import { AuthException } from 'src/common/exceptions/auth.exceptions';
import { ERROR_MESSAGES } from 'src/common/messages/error-messages';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PatientsService } from 'src/secured/patients/providers/patients.service';

@Injectable()
export class UsersService extends GenericService<User> {
  private readonly SALT_ROUNDS = 10;

  constructor(
    protected readonly pool: PoolService,
    protected readonly dao: UsersDao<User>,
    protected readonly patientsService: PatientsService,
  ) {
    super(pool, dao);
  }

  register(dto: RegisterRequest) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const existing = await this.findOneBy(client, {
        email: dto.email,
      });

      if (existing) {
        throw new AuthException(
          ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }

      const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

      const user = await this.insertWithPool(client, {
        email: dto.email,
        password_hash: passwordHash,
        phone: dto.phone ?? null,
        role: 'PATIENT',
      });

      await this.patientsService.insertWithPool(client, {
        user_id: user.id,
        full_name: dto.fullName,
      });

      return { client, user_id: user.id, user_role: user.role };
    });
  }

  login(dto: LoginRequest) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const user = await this.dao.findOneBy(client, {
        email: dto.email,
      });

      if (!user) {
        throw new AuthException(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const passwordMatches = await bcrypt.compare(
        dto.password,
        user.password_hash,
      );

      if (!passwordMatches) {
        throw new AuthException(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      if (!user.is_active) {
        throw new AuthException(
          ERROR_MESSAGES.ACCOUNT_INACTIVE,
          HttpStatus.FORBIDDEN,
        );
      }
      return { client, user_id: user.id, user_role: user.role };
    });
  }

  getDefaultColumns(): string[] | Record<string, any> {
    return ['*'];
  }
}
