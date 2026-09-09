import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../../core/base.service';
import { PoolService } from '../../../core/pool.service';
import { wrapInTransaction } from '../../../utils';
import { ERROR_MESSAGES } from '../../../common/messages/error-messages';
import { DoctorException } from '../../../common/exceptions/doctor.exceptions';
import { DoctorsDao } from './doctors.dao';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';
import { AssignSpecialtyDto } from '../dto/assign-specialty.dto';
import { AssignWorkplaceDto } from '../dto/assign-workplace.dto';
import { Principal } from '../../../common/principal';
import { SpecialtiesDao } from '../../specialties/providers/specialties.dao';
import { DoctorSpecialtiesDao } from './doctor-specialties.dao';
import { WorkplacesDao } from '../../workplaces/providers/workplaces.dao';
import { DoctorWorkplacesDao } from './doctor-workplaces.dao';

@Injectable()
export class DoctorsService extends BaseService {
  constructor(
    poolService: PoolService,
    private readonly doctorsDao: DoctorsDao,
    private readonly specialtiesDao: SpecialtiesDao,
    private readonly doctorSpecialtiesDao: DoctorSpecialtiesDao,
    private readonly workplacesDao: WorkplacesDao,
    private readonly doctorWorkplacesDao: DoctorWorkplacesDao,
  ) {
    super(poolService, doctorsDao);
  }

  search(
    search?: string,
    specialtyId?: number,
    limit?: number,
    offset?: number,
  ) {
    return this.doctorsDao.searchByName(
      this.poolService.pool,
      search,
      specialtyId,
      limit,
      offset,
    );
  }

  async findOneDetailed(id: string) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const doctor = await this.doctorsDao.findOne(client, id);

      if (!doctor) {
        return null;
      }

      const [specialties, workplaces] = await Promise.all([
        this.doctorSpecialtiesDao.findSpecialtiesForDoctor(client, id),
        this.doctorWorkplacesDao.findWorkplacesForDoctor(client, id),
      ]);

      return { ...doctor, specialties, workplaces };
    });
  }

  updateProfile(
    doctorId: string,
    dto: UpdateDoctorDto,
    requestingUser: Principal,
  ) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const doctor = await this.assertCanManage(
        client,
        doctorId,
        requestingUser,
      );

      const values: Record<string, any> = {};
      if (dto.fullName !== undefined) values.full_name = dto.fullName;
      if (dto.bio !== undefined) values.bio = dto.bio;
      if (dto.experienceYears !== undefined) {
        values.experience_years = dto.experienceYears;
      }

      const [updated] = await this.doctorsDao.update(client, values, {
        id: doctor.id,
      });

      return updated;
    });
  }

  assignSpecialty(
    doctorId: string,
    dto: AssignSpecialtyDto,
    requestingUser: Principal,
  ) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const doctor = await this.assertCanManage(
        client,
        doctorId,
        requestingUser,
      );

      const specialty = await this.specialtiesDao.findOne(
        client,
        dto.specialtyId,
      );

      if (!specialty) {
        throw new DoctorException(
          ERROR_MESSAGES.SPECIALTY_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.doctorSpecialtiesDao.assign(
        client,
        doctor.id,
        dto.specialtyId,
      );

      return this.doctorSpecialtiesDao.findSpecialtiesForDoctor(
        client,
        doctor.id,
      );
    });
  }

  unassignSpecialty(
    doctorId: string,
    specialtyId: number,
    requestingUser: Principal,
  ) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const doctor = await this.assertCanManage(
        client,
        doctorId,
        requestingUser,
      );

      await this.doctorSpecialtiesDao.unassign(client, doctor.id, specialtyId);

      return this.doctorSpecialtiesDao.findSpecialtiesForDoctor(
        client,
        doctor.id,
      );
    });
  }

  assignWorkplace(
    doctorId: string,
    dto: AssignWorkplaceDto,
    requestingUser: Principal,
  ) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const doctor = await this.assertCanManage(
        client,
        doctorId,
        requestingUser,
      );

      const workplace = await this.workplacesDao.findOne(
        client,
        dto.workplaceId,
      );

      if (!workplace) {
        throw new DoctorException(
          ERROR_MESSAGES.WORKPLACE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.doctorWorkplacesDao.assign(
        client,
        doctor.id,
        dto.workplaceId,
      );

      return this.doctorWorkplacesDao.findWorkplacesForDoctor(
        client,
        doctor.id,
      );
    });
  }

  unassignWorkplace(
    doctorId: string,
    workplaceId: string,
    requestingUser: Principal,
  ) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const doctor = await this.assertCanManage(
        client,
        doctorId,
        requestingUser,
      );

      await this.doctorWorkplacesDao.unassign(client, doctor.id, workplaceId);

      return this.doctorWorkplacesDao.findWorkplacesForDoctor(
        client,
        doctor.id,
      );
    });
  }

  // Checks the doctor exists and requestingUser may manage it (ADMIN or
  // the doctor themselves). Returns the found doctor row.
  private async assertCanManage(
    client: Parameters<DoctorsDao['findOne']>[0],
    doctorId: string,
    requestingUser: Principal,
  ) {
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

    return doctor;
  }
}
