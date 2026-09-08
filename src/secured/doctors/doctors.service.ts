import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base.service';
import { PoolService } from '../../core/pool.service';
import { wrapInTransaction } from '../../utils';
import { ERROR_MESSAGES } from '../../common/messages/error-messages';
import { DoctorException } from '../../common/exceptions/doctor.exceptions';
import { DoctorsDao } from './doctors.dao';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

type RequestingUser = { userId: string; role: JwtPayload['role'] };

@Injectable()
export class DoctorsService extends BaseService {
  constructor(
    poolService: PoolService,
    private readonly doctorsDao: DoctorsDao,
  ) {
    super(poolService, doctorsDao);
  }

  search(search?: string, limit?: number, offset?: number) {
    return this.doctorsDao.searchByName(
      this.poolService.pool,
      search,
      limit,
      offset,
    );
  }

  // ADMIN can edit any profile. DOCTOR can only edit their own — checked
  // here since RolesGuard only knows the role, not ownership.
  updateProfile(
    doctorId: string,
    dto: UpdateDoctorDto,
    requestingUser: RequestingUser,
  ) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const doctor = await this.doctorsDao.findOne(client, doctorId);

      if (!doctor) {
        throw new DoctorException(
          ERROR_MESSAGES.DOCTOR_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const isAdmin = requestingUser.role === 'ADMIN';
      const isOwner = doctor.user_id === requestingUser.userId;

      if (!isAdmin && !isOwner) {
        throw new DoctorException(
          ERROR_MESSAGES.NOT_PROFILE_OWNER,
          HttpStatus.FORBIDDEN,
        );
      }

      const values: Record<string, any> = {};
      if (dto.fullName !== undefined) values.full_name = dto.fullName;
      if (dto.bio !== undefined) values.bio = dto.bio;
      if (dto.experienceYears !== undefined) {
        values.experience_years = dto.experienceYears;
      }

      const [updated] = await this.doctorsDao.update(client, values, {
        id: doctorId,
      });

      return updated;
    });
  }
}
