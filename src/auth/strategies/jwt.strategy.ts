import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Principal } from '../../common/principal';
import { PoolService } from '../../core/pool.service';
import { UsersService } from '../modules/users/providers/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly poolService: PoolService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET!,
    });
  }

  // Runs on every protected request — even with a validly signed token,
  // re-checks that the user still exists and is active in the database.
  async validate(payload: JwtPayload): Promise<Principal> {
    const user = await this.usersService.checkForExistById(payload.sub);
    if (!user || !user.is_active) {
      throw new UnauthorizedException();
    }

    return new Principal(user.id, user.role, user.email);
  }
}
