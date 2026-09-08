import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  experienceYears?: number;
}
