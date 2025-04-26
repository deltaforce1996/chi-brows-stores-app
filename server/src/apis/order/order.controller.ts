// src/order/order.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { Successfully } from 'src/res/successfully';
import { OrderStatus } from 'src/utils/order-status.enum';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<any> {
    const result = await this.orderService.create(createOrderDto);
    return new Successfully<any>('Register successfully.', result);
  }

  @Get('list')
  async findAll(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ): Promise<any> {
    const { data, total } = await this.orderService.findAll(
      Number(page),
      Number(pageSize),
    );

    const totalPages = Math.ceil(total / Number(pageSize));

    return new Successfully<any>('Get successfully.', {
      items: data,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        totalItems: total,
        totalPages: totalPages,
      },
    });
  }

  @Get('find/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    const result = await this.orderService.findOne(id);
    return new Successfully<any>('Get successfully.', result);
  }

  @Put('update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<any> {
    const result = await this.orderService.updateStatus(
      id,
      updateOrderStatusDto,
    );
    return new Successfully<any>('Update successfully.', result);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<any> {
    await this.orderService.remove(id);
    return new Successfully<any>('Delete successfully.');
  }

  @Get('search')
  async searchOrders(
    @Query('orderId') orderId?: string,
    @Query('customerId') customerId?: string,
    @Query('customerName') customerName?: string,
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: OrderStatus,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    const filters = {
      orderId,
      customerId,
      customerName,
      employeeId,
      status,
    };

    const { data, total } = await this.orderService.searchOrders(
      filters,
      Number(page),
      Number(pageSize),
    );

    const totalPages = Math.ceil(total / Number(pageSize));

    return new Successfully<any>('Get successfully.', {
      items: data,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        totalItems: total,
        totalPages: totalPages,
      },
    });
  }
}
