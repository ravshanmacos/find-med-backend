import { UsersDao } from './users.dao';
import { UsersService } from './users.service';

export const UsersProviders = [
  { useClass: UsersDao, provide: UsersDao },
  { useClass: UsersService, provide: UsersService },
];