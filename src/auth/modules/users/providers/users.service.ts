import { GenericService } from 'src/core/generic.service';
import { PoolService } from 'src/core/pool.service';
import { AuthTokens } from 'src/auth/interfaces/jwt-payload.interface';
import { UsersDao } from './users.dao';
import { RegisterRequest, LoginRequest, User } from '../models/user.model';
import { wrapInTransaction } from 'src/utils';
import { AuthException } from 'src/common/exceptions/auth.exceptions';
import { ERROR_MESSAGES } from 'src/common/messages/error-messages';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PatientsService } from 'src/secured/patients/providers/patients.service';
import { RefreshTokenService } from '../../refreshTokens/providers/refresh-token.service';

const SALT_ROUNDS = 10;

export class UsersService extends GenericService<User> {
  constructor(
    protected readonly pool: PoolService,
    protected readonly dao: UsersDao<User>,
    protected readonly patientsService: PatientsService,
    protected readonly usersService: UsersService,
    protected readonly refreshTokenService: RefreshTokenService,
  ) {
    super(pool, dao);
  }

  register(dto: RegisterRequest): Promise<AuthTokens> {
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

      const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

      const user = await this.usersService.insertWithPool(client, {
        email: dto.email,
        password_hash: passwordHash,
        phone: dto.phone ?? null,
        role: 'PATIENT',
      });

      await this.patientsService.insertWithPool(client, {
        user_id: user.id,
        full_name: dto.fullName,
      });

      return this.refreshTokenService.issueTokens(client, user.id, user.role);
    });
  }

  login(dto: LoginRequest): Promise<AuthTokens> {
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

      return this.refreshTokenService.issueTokens(client, user.id, user.role);
    });
  }

  getDefaultColumns(): string[] | Record<string, any> {
    return ['*'];
  }
}
