import { GenericModel } from 'src/core/generic.model';
import { IsNotEmpty, IsString } from 'class-validator';

export interface ISpecialty extends GenericModel {
  name: string;
}

export class Specialty extends GenericModel implements ISpecialty {
  @IsNotEmpty()
  @IsString()
  name: string;
}
