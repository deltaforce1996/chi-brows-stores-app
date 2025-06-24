import { Injectable, UseFilters } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';
import { JwtService } from '@nestjs/jwt';
import { EmployeeBase } from 'src/types/employee.interface';
import { AuthorizedExcept } from 'src/errors/exception.error';
import {
  AuthorizedExceptFilter,
  BadRequestExceptFilter,
  ForbiddenExceptionFilter,
  ResultNotFoundExceptFilter,
} from 'src/errors/filter.error';

@Injectable()
@UseFilters(
  new ResultNotFoundExceptFilter(),
  new BadRequestExceptFilter(),
  new AuthorizedExceptFilter(),
  new ForbiddenExceptionFilter(),
)
export class AuthService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string) {
    const user: EmployeeBase | null = await this.employeeService.login(
      username,
      pass,
    );
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ access_token: string; user: EmployeeBase }> {
    const user = await this.validateUser(username, password);
    if (!user) throw new AuthorizedExcept('Invalid credentials');
    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);
    return { access_token: token, user };
  }
}
