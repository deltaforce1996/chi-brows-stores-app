import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  // UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dtos/employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  AuthorizedExceptFilter,
  BadRequestExceptFilter,
  ForbiddenExceptionFilter,
  InternalServerErrorExceptFilter,
  ResultNotFoundExceptFilter,
} from 'src/errors/filter.error';
import { Successfully } from 'src/res/successfully';
import {
  EmployeeBase,
  EmployeeSearchResponse,
} from 'src/types/employee.interface';

@Controller('employees')
@UseFilters(
  new ResultNotFoundExceptFilter(),
  new BadRequestExceptFilter(),
  new AuthorizedExceptFilter(),
  new ForbiddenExceptionFilter(),
  new InternalServerErrorExceptFilter(),
)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('register')
  async register(@Body() dto: CreateEmployeeDto) {
    const result = await this.employeeService.register(dto);
    return new Successfully<EmployeeBase>('Register successfully.', result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    const { data, total } = await this.employeeService.searchUser(
      q,
      Number(page),
      Number(pageSize),
    );

    const totalPages = Math.ceil(total / Number(pageSize));

    return new Successfully<EmployeeSearchResponse>('Search successfully.', {
      items: data,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        totalItems: total,
        totalPages: totalPages,
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('find/:id')
  async getById(@Param('id') id: string) {
    const result = await this.employeeService.getById(id);
    return new Successfully<EmployeeBase>('Get successfully.', result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: any) {
    const result = await this.employeeService.getById(user.id);
    return new Successfully<EmployeeBase>('Get successfully.', result);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    const result = await this.employeeService.update(id, dto);
    return new Successfully<EmployeeBase>('Update successfully.', result);
  }
}
