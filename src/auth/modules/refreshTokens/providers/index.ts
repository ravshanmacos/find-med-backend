import { RefreshTokensDao } from './refresh-tokens.dao';
import { RefreshTokenService } from './refresh-token.service';

export const RefreshTokensProviders = [
  { useClass: RefreshTokensDao, provide: RefreshTokensDao },
  { useClass: RefreshTokenService, provide: RefreshTokenService },
];
