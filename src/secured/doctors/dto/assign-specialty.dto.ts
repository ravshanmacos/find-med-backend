import { IsInt, Min } from 'class-validator';

export class AssignSpecialtyDto {
  @IsInt()
  @Min(1)
  specialtyId: number;
}
