import { IsDateString, IsString } from 'class-validator';

export class CreatCustomerDto {
  @IsString()
  tel: string;
  @IsString()
  line: string;
  @IsString()
  facebook: string;
  @IsString()
  fullname: string;
  @IsString()
  nickname: string;
  @IsString()
  address: string;
  @IsDateString()
  birthday: Date;
}
