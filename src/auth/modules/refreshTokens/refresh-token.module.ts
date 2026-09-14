import { Module } from '@nestjs/common';
import { RefreshTokensProviders } from './providers';
import { RefreshTokenService } from './providers/refresh-token.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      // note: expiresIn is passed per-call in AuthService.sign()
    }),
    UsersModule,
  ],
  providers: [...RefreshTokensProviders, JwtStrategy],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
