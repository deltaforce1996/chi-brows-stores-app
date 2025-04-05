import { IsString, IsEmail, IsDateString } from 'class-validator';

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
