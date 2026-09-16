import { HttpStatus, Injectable } from '@nestjs/common';
import { PoolService } from 'src/core/pool.service';
import { wrapInTransaction } from 'src/utils';
import { ERROR_MESSAGES } from 'src/common/messages/error-messages';
import { DoctorException } from 'src/common/exceptions/doctor.exceptions';
import { Principal } from 'src/common/principal';
import { GenericService } from 'src/core/generic.service';
import { WorkplacesService } from 'src/secured/workplaces/providers/workplaces.service';
import { SpecialtiesService } from 'src/secured/specialties/providers/specialties.service';
import { DoctorsDao } from './doctors.dao';
import {
  UpdateDoctorDto,
  AssignSpecialtyDto,
  AssignWorkplaceDto,
} from '../dto';
import { Doctor } from '../models/doctor.model';
import { DoctorSpecialtiesService } from '../modules/doctorSpecialties/doctor-specialties.service';
import { DoctorWorkplacesService } from '../modules/doctorWorkplaces/doctor-workplaces.service';

@Injectable()
export class DoctorsService extends GenericService<Doctor> {
  constructor(
    poolService: PoolService,
    protected readonly dao: DoctorsDao<Doctor>,
    protected readonly specialtiesService: SpecialtiesService,
    protected readonly doctorSpecialtiesService: DoctorSpecialtiesService,
    protected readonly workplacesService: WorkplacesService,
    protected readonly doctorWorkplacesService: DoctorWorkplacesService,
  ) {
    super(poolService, dao);
  }

  search(
    search?: string,
    specialtyId?: number,
    regionId?: number,
    districtId?: number,
    limit?: number,
    offset?: number,
  ) {
    return this.dao.searchByName(
      this.poolService.pool,
      search,
      specialtyId,
      regionId,
      districtId,
      limit,
      offset,
    );
  }

  async findOneDetailed(id: string) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const doctor = await this.checkForExistByIdWithPool(client, id);

      if (!doctor) {
        return null;
      }

      const [specialties, workplaces] = await Promise.all([
        this.doctorSpecialtiesService.findSpecialtiesForDoctor(client, id),
        this.doctorWorkplacesService.findWorkplacesForDoctor(client, id),
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
      const doctor = await this.checkForExistByIdWithPool(client, doctorId);
      this.checkPrivilage(doctor, requestingUser);

      const values: Record<string, any> = {};
      if (dto.fullName !== undefined) values.full_name = dto.fullName;
      if (dto.bio !== undefined) values.bio = dto.bio;
      if (dto.experienceYears !== undefined) {
        values.experience_years = dto.experienceYears;
      }
      if (dto.regionId !== undefined) values.region_id = dto.regionId;
      if (dto.districtId !== undefined) values.district_id = dto.districtId;

      const [updated] = await this.dao.update(client, values, {
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
      const doctor = await this.checkForExistByIdWithPool(client, doctorId);
      this.checkPrivilage(doctor, requestingUser);

      const specialty = await this.specialtiesService.checkForExistByIdWithPool(
        client,
        dto.specialtyId,
      );

      await this.doctorSpecialtiesService.assign(
        client,
        doctor.id,
        specialty.id,
      );

      return this.doctorSpecialtiesService.findSpecialtiesForDoctor(
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
      const doctor = await this.checkForExistByIdWithPool(client, doctorId);
      this.checkPrivilage(doctor, requestingUser);

      await this.doctorSpecialtiesService.unassign(
        client,
        doctor.id,
        specialtyId,
      );

      return this.doctorSpecialtiesService.findSpecialtiesForDoctor(
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
      const doctor = await this.checkForExistByIdWithPool(client, doctorId);
      this.checkPrivilage(doctor, requestingUser);

      const workplace = await this.workplacesService.checkForExistByIdWithPool(
        client,
        dto.workplaceId,
      );

      await this.doctorWorkplacesService.assign(
        client,
        doctor.id,
        workplace.id,
      );
      return this.doctorWorkplacesService.findWorkplacesForDoctor(
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
      const doctor = await this.checkForExistByIdWithPool(client, doctorId);
      this.checkPrivilage(doctor, requestingUser);

      await this.doctorWorkplacesService.unassign(
        client,
        doctor.id,
        workplaceId,
      );

      return this.doctorWorkplacesService.findWorkplacesForDoctor(
        client,
        doctor.id,
      );
    });
  }

  private checkPrivilage(doctor: Doctor, requestingUser: Principal) {
    const isAdmin = requestingUser.role === 'ADMIN';
    const isOwner = doctor.user_id === requestingUser.userId;

    if (!isAdmin && !isOwner) {
      throw new DoctorException(
        ERROR_MESSAGES.NOT_PROFILE_OWNER,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  getDefaultColumns(): string[] {
    return defaultColumns;
  }
}

const defaultColumns = ['*']; //Object.keys({});

const getProps = ({}) => ({});
