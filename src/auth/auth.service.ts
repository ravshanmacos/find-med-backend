import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PoolService } from '../core/pool.service';
import { Queryable } from '../common/constants/constants';
import { wrapInTransaction } from '../utils';
import { ERROR_MESSAGES } from '../common/messages/error-messages';
import { AuthException } from '../common/exceptions/auth.exceptions';
import { UsersDao } from './dao/users.dao';
import { PatientsDao } from '../secured/patients/providers/patients.dao';
import { RefreshTokensDao } from './dao/refresh-tokens.dao';
import { DoctorsDao } from '../secured/doctors/providers/doctors.dao';
import { DoctorInvitesDao } from './dao/doctor-invites.dao';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AcceptDoctorInviteDto } from './dto/accept-doctor-invite.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { AuthTokens, JwtPayload } from './interfaces/jwt-payload.interface';

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN ?? '20m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '30d';
const DOCTOR_INVITE_EXPIRES_IN = process.env.DOCTOR_INVITE_EXPIRES_IN ?? '7d';
const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly poolService: PoolService,
    private readonly usersDao: UsersDao,
    private readonly patientsDao: PatientsDao,
    private readonly refreshTokensDao: RefreshTokensDao,
    private readonly doctorsDao: DoctorsDao,
    private readonly doctorInvitesDao: DoctorInvitesDao,
    private readonly jwtService: JwtService,
  ) {}

  register(dto: RegisterDto): Promise<AuthTokens> {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const existing = await this.usersDao.findOneBy(client, {
        email: dto.email,
      });

      if (existing) {
        throw new AuthException(
          ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }

      const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

      const user = await this.usersDao.insert(client, {
        email: dto.email,
        password_hash: passwordHash,
        phone: dto.phone ?? null,
        role: 'PATIENT',
      });

      await this.patientsDao.insert(client, {
        user_id: user.id,
        full_name: dto.fullName,
      });

      return this.issueTokens(client, user.id, user.role);
    });
  }

  login(dto: LoginDto): Promise<AuthTokens> {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const user = await this.usersDao.findOneBy(client, {
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

      return this.issueTokens(client, user.id, user.role);
    });
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const tokenHash = this.hashToken(refreshToken);
      const stored = await this.refreshTokensDao.findValidByHash(
        client,
        tokenHash,
      );

      if (!stored) {
        throw new AuthException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
      }

      const user = await this.usersDao.findOne(client, stored.user_id);

      if (!user || !user.is_active) {
        throw new AuthException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
      }

      await this.refreshTokensDao.update(
        client,
        { revoked_at: new Date() },
        { id: stored.id },
      );

      return this.issueTokens(client, user.id, user.role);
    });
  }

  async logout(refreshToken: string): Promise<{ success: true }> {
    const tokenHash = this.hashToken(refreshToken);

    await this.refreshTokensDao.update(
      this.poolService.pool,
      { revoked_at: new Date() },
      { token_hash: tokenHash },
    );

    return { success: true };
  }

  /**
   * Called by an admin: creates a new Doctor record AND generates its
   * invite in the same request — one round trip instead of two.
   */
  createDoctorWithInvite(
    dto: CreateDoctorDto,
  ): Promise<{ doctorId: string; inviteToken: string; expiresAt: Date }> {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const doctor = await this.doctorsDao.insert(client, {
        full_name: dto.fullName,
        bio: dto.bio ?? null,
        experience_years: dto.experienceYears ?? null,
      });

      const invite = await this.generateInvite(client, doctor.id);

      return { doctorId: doctor.id, ...invite };
    });
  }

  /**
   * Called by an admin. Re-issues an invite for an existing (but not yet
   * linked) doctor — e.g. when the old invite has expired.
   */
  createDoctorInvite(
    doctorId: string,
  ): Promise<{ inviteToken: string; expiresAt: Date }> {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const doctor = await this.doctorsDao.findOne(client, doctorId);

      if (!doctor) {
        throw new AuthException(
          ERROR_MESSAGES.DOCTOR_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      if (doctor.user_id) {
        throw new AuthException(
          ERROR_MESSAGES.DOCTOR_ALREADY_LINKED,
          HttpStatus.CONFLICT,
        );
      }

      return this.generateInvite(client, doctorId);
    });
  }

  /**
   * Called by the doctor. Validates the invite, creates a User, links
   * Doctor.user_id, then immediately logs them in.
   */
  acceptDoctorInvite(dto: AcceptDoctorInviteDto): Promise<AuthTokens> {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const tokenHash = this.hashToken(dto.token);
      const invite = await this.doctorInvitesDao.findValidByHash(
        client,
        tokenHash,
      );

      if (!invite) {
        throw new AuthException(ERROR_MESSAGES.INVALID_OR_EXPIRED_INVITE);
      }

      const doctor = await this.doctorsDao.findOne(client, invite.doctor_id);

      if (!doctor || doctor.user_id) {
        throw new AuthException(
          ERROR_MESSAGES.DOCTOR_ALREADY_LINKED,
          HttpStatus.CONFLICT,
        );
      }

      const existingUser = await this.usersDao.findOneBy(client, {
        email: dto.email,
      });

      if (existingUser) {
        throw new AuthException(
          ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }

      const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

      const user = await this.usersDao.insert(client, {
        email: dto.email,
        password_hash: passwordHash,
        phone: dto.phone ?? null,
        role: 'DOCTOR',
      });

      await this.doctorsDao.update(
        client,
        { user_id: user.id },
        { id: doctor.id },
      );

      await this.doctorInvitesDao.update(
        client,
        { used_at: new Date() },
        { id: invite.id },
      );

      return this.issueTokens(client, user.id, user.role);
    });
  }

  /**
   * Creates an invite row (hash stored) for doctorId and returns the raw
   * token. Callers (createDoctorWithInvite / createDoctorInvite) are
   * responsible for checking beforehand that the doctor exists and isn't
   * already linked.
   */
  private async generateInvite(
    client: Queryable,
    doctorId: string,
  ): Promise<{ inviteToken: string; expiresAt: Date }> {
    const rawInviteToken = crypto.randomBytes(48).toString('hex');
    const tokenHash = this.hashToken(rawInviteToken);
    const expiresAt = new Date(
      Date.now() + this.parseExpiryToMs(DOCTOR_INVITE_EXPIRES_IN),
    );

    await this.doctorInvitesDao.insert(client, {
      doctor_id: doctorId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    return { inviteToken: rawInviteToken, expiresAt };
  }

  private async issueTokens(
    client: Queryable,
    userId: string,
    role: JwtPayload['role'],
  ): Promise<AuthTokens> {
    const accessToken = this.jwtService.sign(
      { sub: userId, role } satisfies JwtPayload,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN as any },
    );

    const rawRefreshToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date(
      Date.now() + this.parseExpiryToMs(REFRESH_TOKEN_EXPIRES_IN),
    );

    await this.refreshTokensDao.insert(client, {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private parseExpiryToMs(value: string): number {
    const match = value.match(/^(\d+)([smhd])$/);
    if (!match) return 30 * 24 * 60 * 60 * 1000;

    const amount = Number(match[1]);
    const unit = match[2] as 's' | 'm' | 'h' | 'd';
    const multipliers: Record<typeof unit, number> = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };

    return amount * multipliers[unit];
  }
}
