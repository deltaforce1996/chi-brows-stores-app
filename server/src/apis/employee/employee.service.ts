import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/db/entities/emp.entity';
import { EmployeeBase } from 'src/types/employee.interface';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dtos/employee.dto';
import * as bcrypt from 'bcrypt';
import { ResultNotFoundExcept } from 'src/errors/exception.error';
import { Repository } from 'typeorm';
import { UserStatus } from 'src/utils/user-status.enum';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepo: Repository<EmployeeEntity>,
  ) {}

  async register(dto: CreateEmployeeDto): Promise<EmployeeBase> {
    const last = await this.employeeRepo
      .createQueryBuilder('emp')
      .orderBy('emp.id', 'DESC')
      .limit(1)
      .getOne();

    const nextId = this.generateNextId(last?.id);

    // ✅ เข้ารหัส password
    const hashedPassword = await bcrypt.hash(dto.password, 10); // 10 = salt rounds

    const newEmployee = this.employeeRepo.create({
      ...dto,
      id: nextId,
      password: hashedPassword,
      birthday: new Date(dto.birthday),
      status: UserStatus.ACTIVE,
    });

    const saved = await this.employeeRepo.save(newEmployee);
    return saved as EmployeeBase;
  }

  async getById(id: string): Promise<EmployeeBase> {
    const emp = await this.employeeRepo.findOneBy({ id });
    if (!emp) throw new ResultNotFoundExcept('Employee not found.');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = emp as EmployeeBase;
    return rest;
  }

  async searchUser(
    query: string,
    page = 1,
    pageSize = 10,
  ): Promise<{ data: EmployeeBase[]; total: number }> {
    const queryBuilder = this.employeeRepo.createQueryBuilder('emp');

    if (query) {
      queryBuilder
        .where('emp.username LIKE :search', { search: `%${query}%` })
        .orWhere('emp.email LIKE :search', { search: `%${query}%` })
        .orWhere('emp.fullname LIKE :search', { search: `%${query}%` })
        .orWhere('emp.tel LIKE :search', { search: `%${query}%` });
    }

    queryBuilder
      .orderBy('emp.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [result, total] = await queryBuilder.getManyAndCount();

    const emps: EmployeeBase[] = result.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ password, ...rest }) => rest as EmployeeBase,
    );

    return { data: emps, total };
  }

  async login(
    username: string,
    password: string,
  ): Promise<EmployeeBase | null> {
    const emp = await this.employeeRepo.findOneBy({ username });

    if (!emp) return null;

    const isMatch = await bcrypt.compare(password, emp.password);
    if (!isMatch) return null;

    return emp as EmployeeBase;
  }

  private generateNextId(lastId?: string): string {
    if (!lastId) return 'EMP0001';
    const num = parseInt(lastId.replace('EMP', ''), 10) + 1;
    return `EMP${num.toString().padStart(4, '0')}`;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<EmployeeBase> {
    const emp = await this.employeeRepo.findOneBy({ id });
    if (!emp) throw new ResultNotFoundExcept('Employee not found.');

    const updated = Object.assign(emp, {
      ...dto,
      birthday: dto.birthday ? new Date(dto.birthday) : emp.birthday,
    });

    const saved = await this.employeeRepo.save(updated);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = saved;
    return rest;
  }
}
