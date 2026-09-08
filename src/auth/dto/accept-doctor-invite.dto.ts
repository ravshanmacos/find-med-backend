import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AcceptDoctorInviteDto {
  @IsString()
  token: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
