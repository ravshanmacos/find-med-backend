import { GenericModel } from 'src/core/generic.model';
import { IsNotEmpty, IsNumber } from 'class-validator';

export interface IDoctorSpecialtiesModel extends GenericModel {
  specialty_id: number;
}
export class DoctorSpecialtiesModel
  extends GenericModel
  implements IDoctorSpecialtiesModel
{
  @IsNotEmpty()
  @IsNumber()
  specialty_id: number;
}
