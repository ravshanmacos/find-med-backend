import * as crypto from 'crypto';
import { GenericService } from 'src/core/generic.service';
import { PoolService } from 'src/core/pool.service';
import { Queryable } from 'src/common/constants/constants';
import { RefreshToken } from '../models/refresh-token.model';
import { RefreshTokensDao } from './refresh-tokens.dao';
import {
  AuthTokens,
  JwtPayload,
} from 'src/auth/interfaces/jwt-payload.interface';
import { wrapInTransaction } from 'src/utils';
import { AuthException } from 'src/common/exceptions/auth.exceptions';
import { ERROR_MESSAGES } from 'src/common/messages/error-messages';
import { UsersService } from '../../users/providers/users.service';
import { JwtService } from '@nestjs/jwt';
import { hashToken, parseExpiryToMs } from 'src/utils';
import { UUID } from '../../../../common/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenService extends GenericService<RefreshToken> {
  private readonly ACCESS_TOKEN_EXPIRES_IN =
    process.env.JWT_ACCESS_EXPIRES_IN ?? '20m';
  private readonly REFRESH_TOKEN_EXPIRES_IN =
    process.env.JWT_REFRESH_EXPIRES_IN ?? '30d';

  constructor(
    protected readonly pool: PoolService,
    protected readonly dao: RefreshTokensDao<RefreshToken>,
    protected readonly usersService: UsersService,
    protected readonly jwtService: JwtService,
  ) {
    super(pool, dao);
  }

  findValidByHash(queryable: Queryable, tokenHash: string) {
    return this.dao.findValidByHash(queryable, tokenHash);
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const tokenHash = hashToken(refreshToken);
      const stored = await this.findValidByHash(client, tokenHash);

      if (!stored) {
        throw new AuthException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
      }

      const user = await this.usersService.checkForExistByIdWithPool(
        client,
        stored.user_id,
      );

      await this.dao.update(
        client,
        { revoked_at: new Date() },
        { id: stored.id },
      );

      return this.issueTokens(client, user.id, user.role);
    });
  }

  async logout(refreshToken: string): Promise<{ success: true }> {
    const tokenHash = hashToken(refreshToken);

    await this.dao.update(
      this.poolService.pool,
      { revoked_at: new Date() },
      { token_hash: tokenHash },
    );

    return { success: true };
  }

  async issueTokens(
    client: Queryable,
    userId: UUID,
    role: JwtPayload['role'],
  ): Promise<AuthTokens> {
    const accessToken = this.jwtService.sign(
      { sub: String(userId), role } satisfies JwtPayload,
      { expiresIn: this.ACCESS_TOKEN_EXPIRES_IN as any },
    );

    const rawRefreshToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = hashToken(rawRefreshToken);
    const expiresAt = new Date(
      Date.now() + parseExpiryToMs(this.REFRESH_TOKEN_EXPIRES_IN),
    );

    await this.dao.insert(client, {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  getDefaultColumns(): string[] | Record<string, any> {
    return ['*'];
  }
}
