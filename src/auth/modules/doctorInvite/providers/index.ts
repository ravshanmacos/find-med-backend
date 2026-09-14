import { DoctorInvitesDao } from './doctor-invites.dao';
import { DoctorInvitesService } from './doctor-invites.service';

export const DoctorInvitesProviders = [
  { useClass: DoctorInvitesDao, provide: DoctorInvitesDao },
  { useClass: DoctorInvitesService, provide: DoctorInvitesService },
];
