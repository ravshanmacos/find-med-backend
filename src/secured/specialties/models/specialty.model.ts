import { GenericModel } from 'src/core/generic.model';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export interface ISpecialty extends GenericModel {
  id: number;
  name: string;
}

export class Specialty extends GenericModel implements ISpecialty {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
