import { GenericModel } from 'src/core/generic.model';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export interface IDistrict extends GenericModel {
  name: string;
  region_id: number;
}

export class District extends GenericModel implements IDistrict {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  region_id: number;
}
