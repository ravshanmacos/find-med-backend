import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PoolService } from '../core/pool.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersDao } from './dao/users.dao';
import { PatientsDao } from './dao/patients.dao';
import { RefreshTokensDao } from './dao/refresh-tokens.dao';
import { DoctorsDao } from './dao/doctors.dao';
import { DoctorInvitesDao } from './dao/doctor-invites.dao';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      // note: expiresIn is passed per-call in AuthService.sign()
    }),
  ],
  controllers: [AuthController],
  providers: [
    PoolService,
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
