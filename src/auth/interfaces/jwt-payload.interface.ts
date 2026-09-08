export interface JwtPayload {
  sub: string; // user id
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
