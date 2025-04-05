import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/db/entities/emp.entity';
import { EmployeeBase } from 'src/types/employee.interface';
import { ILike, Repository } from 'typeorm';
import { CreateEmployeeDto } from './dtos/employee.dto';
import * as bcrypt from 'bcrypt';

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
    });

    const saved = await this.employeeRepo.save(newEmployee);
    return saved as EmployeeBase;
  }

  async getById(id: string): Promise<EmployeeEntity> {
    const emp = await this.employeeRepo.findOneBy({ id });
    return emp as EmployeeEntity;
  }

  async searchUser(query: string): Promise<EmployeeEntity[]> {
    return await this.employeeRepo.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
        { fullname: ILike(`%${query}%`) },
      ],
    });
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
}
