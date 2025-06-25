import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserStatus } from 'src/utils/user-status.enum';

export class CreatCustomerDto {
  @IsOptional()
  @IsString()
  tel?: string;

  @IsOptional()
  @IsString()
  line?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  tel?: string;

  @IsOptional()
  @IsString()
  line?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
