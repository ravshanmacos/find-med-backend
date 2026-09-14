import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './modules/users/users.module';
import { RefreshTokenModule } from './modules/refreshTokens/refresh-token.module';
import { DoctorInviteModule } from './modules/doctorInvite/doctor-invite.module';

@Module({
  imports: [UsersModule, RefreshTokenModule, DoctorInviteModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
