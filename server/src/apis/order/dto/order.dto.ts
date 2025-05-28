// src/order/dto/create-order-item.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreatCustomerDto } from 'src/apis/customer/dtos/customer.dto';
import { OrderStatus } from 'src/utils/order-status.enum';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string; // ID of the product being ordered

  @IsNumber()
  @IsPositive() // Quantity must be greater than 0
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  employeeId?: string; // Optional employee handling the order

  @IsArray()
  @ValidateNested({ each: true }) // Validate each item in the array
  @Type(() => CreateOrderItemDto) // Tell class-validator how to transform
  @IsNotEmpty({ each: true })
  items: CreateOrderItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class CreateOrderWithCustomerDto {
  @ValidateNested()
  @Type(() => CreatCustomerDto)
  customer: CreatCustomerDto;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
