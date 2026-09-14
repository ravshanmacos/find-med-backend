import { GenericModel } from 'src/core/generic.model';
import { IsNotEmpty, IsNumber } from 'class-validator';

export interface IDoctorWorkplacesModel extends GenericModel {
  specialty_id: number;
}
export class DoctorWorkplacesModel
  extends GenericModel
  implements IDoctorWorkplacesModel
{
  @IsNotEmpty()
  @IsNumber()
  specialty_id: number;
}
