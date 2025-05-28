import {
  IsString,
  IsEmail,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserStatus } from 'src/utils/user-status.enum';

export class CreateEmployeeDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  fullname: string;

  @IsString()
  tel: string;

  @IsEmail()
  email: string;

  @IsDateString()
  birthday: string;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsString()
  tel?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
