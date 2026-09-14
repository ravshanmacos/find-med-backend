import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { GenericModel } from 'src/core/generic.model';
import type { Role } from 'src/common/principal';
import { OmitType } from '@nestjs/swagger';

export interface IUser extends GenericModel {
  email: string;
  password_hash: string;
  phone?: string;
  role: Role;
  is_active: boolean;
}

export class User extends GenericModel implements IUser {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password_hash: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  role: Role;

  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;
}

export class RegisterRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class LoginRequest extends OmitType(RegisterRequest, [
  'fullName',
  'phone',
]) {}
