import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { EmployeeBase } from 'src/types/employee.interface';
import { AuthService } from './auth.service';
import { AuthorizedExceptFilter } from 'src/errors/filter.error';

@Controller('auth')
@UseFilters(new AuthorizedExceptFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
  ): Promise<{ access_token: string; user: EmployeeBase }> {
    return await this.authService.login(body.username, body.password);
  }
}
