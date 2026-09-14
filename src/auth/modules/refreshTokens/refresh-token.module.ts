import { Module } from '@nestjs/common';
import { DoctorInvitesProviders } from '../doctorInvite/providers';
import { DoctorInvitesService } from '../doctorInvite/providers/doctor-invites.service';

@Module({
  imports: [],
  providers: [...DoctorInvitesProviders],
  exports: [DoctorInvitesService],
})
export class RefreshTokenModule {}
