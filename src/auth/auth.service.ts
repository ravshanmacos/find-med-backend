import { Injectable } from '@nestjs/common';
import { AcceptDoctorInviteDto } from './dto/accept-doctor-invite.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UsersService } from './modules/users/providers/users.service';
import {
  LoginRequest,
  RegisterRequest,
} from './modules/users/models/user.model';
import { RefreshTokenService } from './modules/refreshTokens/providers/refresh-token.service';
import { DoctorInvitesService } from './modules/doctorInvite/providers/doctor-invites.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    protected readonly refreshTokenService: RefreshTokenService,
    protected readonly doctorInvitesService: DoctorInvitesService,
  ) {}

  async register(dto: RegisterRequest) {
    const { client, user_id, user_role } =
      await this.usersService.register(dto);
    return await this.refreshTokenService.issueTokens(
      client,
      user_id,
      user_role,
    );
  }

  async login(dto: LoginRequest) {
    const { client, user_id, user_role } = await this.usersService.login(dto);
    return await this.refreshTokenService.issueTokens(
      client,
      user_id,
      user_role,
    );
  }

  refresh(refreshToken: string) {
    return this.refreshTokenService.refresh(refreshToken);
  }

  async logout(refreshToken: string) {
    return this.refreshTokenService.logout(refreshToken);
  }

  /**
   * Called by an admin: creates a new Doctor record AND generates its
   * invite in the same request — one round trip instead of two.
   */
  createDoctorWithInvite(dto: CreateDoctorDto) {
    return this.doctorInvitesService.createDoctorWithInvite(dto);
  }

  /**
   * Called by an admin. Re-issues an invite for an existing (but not yet
   * linked) doctor — e.g. when the old invite has expired.
   */
  createDoctorInvite(doctorId: string) {
    return this.doctorInvitesService.createDoctorInvite(doctorId);
  }

  /**
   * Called by the doctor. Validates the invite, creates a User, links
   * Doctor.user_id, then immediately logs them in.
   */
  async acceptDoctorInvite(dto: AcceptDoctorInviteDto) {
    const { client, user_id, user_role } =
      await this.doctorInvitesService.acceptDoctorInvite(dto);
    return this.refreshTokenService.issueTokens(client, user_id, user_role);
  }
}
