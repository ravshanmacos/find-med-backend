import { GenericService } from 'src/core/generic.service';
import { PoolService } from 'src/core/pool.service';
import { Queryable } from 'src/common/constants/constants';
import { DoctorInvite } from '../models/doctor-invite.model';
import { DoctorInvitesDao } from './doctor-invites.dao';
import { CreateDoctorDto } from 'src/auth/dto/create-doctor.dto';
import { hashToken, parseExpiryToMs, wrapInTransaction } from 'src/utils';
import { AuthException } from 'src/common/exceptions/auth.exceptions';
import { ERROR_MESSAGES } from 'src/common/messages/error-messages';
import { HttpStatus } from '@nestjs/common';
import { AcceptDoctorInviteDto } from 'src/auth/dto/accept-doctor-invite.dto';
import { AuthTokens } from 'src/auth/interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { DoctorsService } from 'src/secured/doctors/providers/doctors.service';
import { RefreshTokenService } from '../../refreshTokens/providers/refresh-token.service';
import { UsersService } from '../../users/providers/users.service';
import { UUID } from '../../../../common/types';

export class DoctorInvitesService extends GenericService<DoctorInvite> {
  private DOCTOR_INVITE_EXPIRES_IN =
    process.env.DOCTOR_INVITE_EXPIRES_IN ?? '7d';
  private SALT_ROUNDS = 10;
  constructor(
    protected readonly pool: PoolService,
    protected readonly dao: DoctorInvitesDao<DoctorInvite>,
    protected readonly doctorService: DoctorsService,
    protected readonly usersService: UsersService,
    protected readonly refreshTokenService: RefreshTokenService,
  ) {
    super(pool, dao);
  }

  createDoctorWithInvite(dto: CreateDoctorDto) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const doctor = await this.doctorService.insertWithPool(client, {
        full_name: dto.fullName,
        bio: dto.bio ?? null,
        experience_years: dto.experienceYears ?? null,
      });

      const invite = await this.generateInvite(client, doctor.id);

      return { doctorId: doctor.id, ...invite };
    });
  }

  createDoctorInvite(doctorId: string) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const doctor = await this.doctorService.checkForExistByIdWithPool(
        client,
        doctorId,
      );

      if (doctor.user_id) {
        throw new AuthException(
          ERROR_MESSAGES.DOCTOR_ALREADY_LINKED,
          HttpStatus.CONFLICT,
        );
      }

      return this.generateInvite(client, doctorId);
    });
  }

  acceptDoctorInvite(dto: AcceptDoctorInviteDto): Promise<AuthTokens> {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const tokenHash = hashToken(dto.token);
      const invite = await this.findValidByHash(client, tokenHash);

      if (!invite) {
        throw new AuthException(ERROR_MESSAGES.INVALID_OR_EXPIRED_INVITE);
      }

      const doctor = await this.doctorService.checkForExistByIdWithPool(
        client,
        invite.doctor_id,
      );

      const existingUser = await this.usersService.findOneBy(client, {
        email: dto.email,
      });

      if (existingUser) {
        throw new AuthException(
          ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }

      const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

      const user = await this.usersService.insertWithPool(client, {
        email: dto.email,
        password_hash: passwordHash,
        phone: dto.phone ?? null,
        role: 'DOCTOR',
      });

      await this.doctorService.updateWithPool(
        client,
        { user_id: user.id },
        { id: doctor.id },
      );

      await this.dao.update(client, { used_at: new Date() }, { id: invite.id });

      return this.refreshTokenService.issueTokens(client, user.id, user.role);
    });
  }

  findValidByHash(queryable: Queryable, tokenHash: string) {
    return this.dao.findValidByHash(queryable, tokenHash);
  }

  /**
   * Creates an invite row (hash stored) for doctorId and returns the raw
   * token. Callers (createDoctorWithInvite / createDoctorInvite) are
   * responsible for checking beforehand that the doctor exists and isn't
   * already linked.
   */
  private async generateInvite(client: Queryable, doctorId: UUID) {
    const rawInviteToken = crypto.randomBytes(48).toString('hex');
    const tokenHash = hashToken(rawInviteToken);
    const expiresAt = new Date(
      Date.now() + parseExpiryToMs(this.DOCTOR_INVITE_EXPIRES_IN),
    );

    await this.insertWithPool(client, {
      doctor_id: doctorId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    return { inviteToken: rawInviteToken, expiresAt };
  }

  getDefaultColumns(): string[] | Record<string, any> {
    return ['*'];
  }
}
