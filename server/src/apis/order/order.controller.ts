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
  UseFilters,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  CreateOrderWithCustomerDto,
  UpdateOrderStatusDto,
} from './dto/order.dto';
import { Successfully } from 'src/res/successfully';
import { OrderStatus } from 'src/utils/order-status.enum';
import {
  AuthorizedExceptFilter,
  BadRequestExceptFilter,
  ForbiddenExceptionFilter,
  InternalServerErrorExceptFilter,
  ResultNotFoundExceptFilter,
} from 'src/errors/filter.error';
import { Request } from 'express';

@UseFilters(
  new ResultNotFoundExceptFilter(),
  new BadRequestExceptFilter(),
  new AuthorizedExceptFilter(),
  new ForbiddenExceptionFilter(),
  new InternalServerErrorExceptFilter(),
)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request,
  ): Promise<any> {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = await this.orderService.create(createOrderDto, baseUrl);
    return new Successfully<any>('Register successfully.', result);
  }

  @Get('list')
  async findAll(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Req() req: Request,
  ): Promise<any> {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const { data, total } = await this.orderService.findAll(
      Number(page),
      Number(pageSize),
      baseUrl,
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
  async findOne(@Param('id') id: string, @Req() req: Request): Promise<any> {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = await this.orderService.findOne(id, baseUrl);
    return new Successfully<any>('Get successfully.', result);
  }

  @Put('update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Req() req: Request,
  ): Promise<any> {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = await this.orderService.updateStatus(
      id,
      updateOrderStatusDto,
      baseUrl,
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
    @Req() req: Request,
    @Query('orderId') orderId?: string,
    @Query('customerId') customerId?: string,
    @Query('customerName') customerName?: string,
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: OrderStatus,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
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
      baseUrl,
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

  @Post('register-with-customer')
  @HttpCode(HttpStatus.CREATED)
  async createWithCustomer(
    @Body() dto: CreateOrderWithCustomerDto,
    @Req() req: Request,
  ): Promise<any> {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = await this.orderService.createWithCustomer(dto, baseUrl);
    return new Successfully<any>(
      'Register order and customer successfully.',
      result,
    );
  }
}
