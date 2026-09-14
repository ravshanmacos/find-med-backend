import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersDao } from './modules/users/providers/users.dao';
import { PatientsDao } from '../secured/patients/providers/patients.dao';
import { RefreshTokensDao } from './modules/refreshTokens/providers/refresh-tokens.dao';
import { DoctorsDao } from '../secured/doctors/providers/doctors.dao';
import { DoctorInvitesDao } from './modules/doctorInvite/providers/doctor-invites.dao';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from './modules/users/users.module';
import { RefreshTokenModule } from './modules/refreshTokens/refresh-token.module';
import { DoctorInviteModule } from './modules/doctorInvite/doctor-invite.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      // note: expiresIn is passed per-call in AuthService.sign()
    }),
    UsersModule,
    RefreshTokenModule,
    DoctorInviteModule,
  ],
  controllers: [AuthController],
  providers: [
    UsersDao,
    PatientsDao,
    RefreshTokensDao,
    DoctorsDao,
    DoctorInvitesDao,
    AuthService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
