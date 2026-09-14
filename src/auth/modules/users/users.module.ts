import { Module } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UsersProviders } from './providers';
import { PatientsModule } from '../../../secured/patients/patients.module';

@Module({
  imports: [PatientsModule],
  providers: [...UsersProviders],
  exports: [UsersService],
})
export class UsersModule {}
