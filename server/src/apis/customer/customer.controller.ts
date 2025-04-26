import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  // UseGuards,
} from '@nestjs/common';
import {
  AuthorizedExceptFilter,
  BadRequestExceptFilter,
  ForbiddenExceptionFilter,
  InternalServerErrorExceptFilter,
  ResultNotFoundExceptFilter,
} from 'src/errors/filter.error';
import { CustomerService } from './customer.service';
import { CreatCustomerDto } from './dtos/customer.dto';
import { Successfully } from 'src/res/successfully';
import { CustBase, CustomerListResponse } from 'src/types/cust.interface';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('customer')
@UseFilters(
  new ResultNotFoundExceptFilter(),
  new BadRequestExceptFilter(),
  new AuthorizedExceptFilter(),
  new ForbiddenExceptionFilter(),
  new InternalServerErrorExceptFilter(),
)
export class CustomerController {
  constructor(private readonly custService: CustomerService) {}

  @Post('register')
  async register(@Body() dto: CreatCustomerDto) {
    const result = await this.custService.register(dto);
    return new Successfully<CustBase>('Register successfully.', result);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchCustomer(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ): Promise<Successfully<CustomerListResponse>> {
    const { data, total } = await this.custService.searchUser(
      query,
      Number(page),
      Number(pageSize),
    );

    const totalPages = Math.ceil(total / Number(pageSize));

    return new Successfully<CustomerListResponse>('Search successfully.', {
      items: data,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        totalItems: total,
        totalPages: totalPages,
      },
    });
  }

  // @UseGuards(JwtAuthGuard)
  @Get('find/:id')
  async getById(@Param('id') id: string) {
    const result = await this.custService.getById(id);
    return new Successfully<CustBase>('Get successfully.', result);
  }
}
