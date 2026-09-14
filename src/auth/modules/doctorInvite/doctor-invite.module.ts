import { Module } from '@nestjs/common';
import { DoctorInvitesService } from './providers/doctor-invites.service';
import { DoctorInvitesProviders } from './providers';

@Module({
  imports: [],
  providers: [...DoctorInvitesProviders],
  exports: [DoctorInvitesService],
})
export class DoctorInviteModule {}
