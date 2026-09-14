import { Module } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UsersProviders } from './providers';

@Module({
  imports: [],
  providers: [...UsersProviders],
  exports: [UsersService],
})
export class UsersModule {}
