import { Role } from '../../common/principal';

export interface JwtPayload {
  sub: string; // user id
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
