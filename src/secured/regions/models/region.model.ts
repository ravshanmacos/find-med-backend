import { GenericModel } from 'src/core/generic.model';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export interface IRegion extends GenericModel {
  name: string;
}

export class Region extends GenericModel implements IRegion {
  @IsNotEmpty()
  @IsString()
  name: string;
}
