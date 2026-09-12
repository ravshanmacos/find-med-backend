import { GenericModel } from 'src/core/generic.model';
import type { UUID } from 'src/common/types';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export interface IDoctorWorkplacesModel extends GenericModel {
  doctor_id: UUID;
  specialty_id: number;
}
export class DoctorWorkplacesModel
  extends GenericModel
  implements IDoctorWorkplacesModel
{
  @IsNotEmpty()
  @IsUUID()
  doctor_id: UUID;

  @IsNotEmpty()
  @IsNumber()
  specialty_id: number;
}
