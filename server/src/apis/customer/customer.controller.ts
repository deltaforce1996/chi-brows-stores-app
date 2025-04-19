import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseGuards,
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
import { CustBase } from 'src/types/cust.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async search(@Query('q') q: string) {
    const results = await this.custService.searchUser(q);
    return new Successfully<CustBase[]>('Search successfully.', results);
  }

  @UseGuards(JwtAuthGuard)
  @Get('find/:id')
  async getById(@Param('id') id: string) {
    const result = await this.custService.getById(id);
    return new Successfully<CustBase>('Get successfully.', result);
  }
}
