import { Module } from '@nestjs/common';
import { DoctorInvitesService } from './providers/doctor-invites.service';
import { DoctorInvitesProviders } from './providers';
import { DoctorsModule } from '../../../secured/doctors/doctors.module';
import { UsersModule } from '../users/users.module';
import { RefreshTokenModule } from '../refreshTokens/refresh-token.module';

@Module({
  imports: [DoctorsModule, UsersModule, RefreshTokenModule],
  providers: [...DoctorInvitesProviders],
  exports: [DoctorInvitesService],
})
export class DoctorInviteModule {}
