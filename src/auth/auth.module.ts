import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PoolService } from '../core/pool.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersDao } from './dao/users.dao';
import { PatientsDao } from './dao/patients.dao';
import { RefreshTokensDao } from './dao/refresh-tokens.dao';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      // note: expiresIn is passed per-call in AuthService.sign()
    }),
  ],
  controllers: [AuthController],
  providers: [PoolService, UsersDao, PatientsDao, RefreshTokensDao, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
