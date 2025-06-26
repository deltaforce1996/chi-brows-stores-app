import { InjectRepository } from '@nestjs/typeorm';
import { CustEntity } from 'src/db/entities/cust.entity';
import { Repository } from 'typeorm';
import { CreatCustomerDto, UpdateCustomerDto } from './dtos/customer.dto';
import { CustBase } from 'src/types/cust.interface';
import {
  BadRequestExcept,
  ResultNotFoundExcept,
} from 'src/errors/exception.error';
import { Injectable } from '@nestjs/common';
import { UserStatus } from 'src/utils/user-status.enum';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustEntity)
    private readonly custRepo: Repository<CustEntity>,
  ) {}

  async register(dto: CreatCustomerDto): Promise<CustBase> {
    // ตรวจสอบข้อมูลซ้ำ เช่น เบอร์โทร, line, หรือ facebook
    const exists = await this.custRepo.findOne({
      where: [
        // { tel: dto.tel },
        // { line: dto.line },
        // { facebook: dto.facebook },
        { fullname: dto.fullname },
      ],
    });

    if (exists) {
      throw new BadRequestExcept(
        'ข้อมูลซ้ำ: เบอร์โทร, Line ID หรือ Facebook มีอยู่แล้ว',
      );
    }

    // หา id ล่าสุด
    const last = await this.custRepo
      .createQueryBuilder('cust')
      .orderBy('cust.id', 'DESC')
      .limit(1)
      .getOne();

    const nextId = this.generateNextId(last?.id);

    const newCust = this.custRepo.create({
      ...dto,
      id: nextId,
      birthday: dto.birthday ? new Date(dto.birthday) : null,
      status: UserStatus.ACTIVE,
    });

    const saved = await this.custRepo.save(newCust);
    return saved as CustBase;
  }

  async getById(id: string): Promise<CustBase> {
    const cust = await this.custRepo.findOneBy({ id });
    if (!cust) throw new ResultNotFoundExcept('Cust not found.');
    return cust;
  }

  async searchUser(
    query: string,
    page = 1,
    pageSize = 10,
  ): Promise<{ data: CustBase[]; total: number }> {
    const queryBuilder = this.custRepo.createQueryBuilder('cust');

    if (query && query.trim() !== '') {
      queryBuilder
        .where('cust.nickname LIKE :search', { search: `%${query}%` })
        .orWhere('cust.fullname LIKE :search', { search: `%${query}%` })
        .orWhere('cust.tel LIKE :search', { search: `%${query}%` })
        .orWhere('cust.line LIKE :search', { search: `%${query}%` })
        .orWhere('cust.facebook LIKE :search', { search: `%${query}%` })
        .orWhere('cust.id LIKE :search', { search: `%${query}%` });
    }

    queryBuilder
      .orderBy('cust.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  private generateNextId(lastId?: string): string {
    if (!lastId) return 'CUST0001';
    const num = parseInt(lastId.replace('CUST', ''), 10) + 1;
    return `CUST${num.toString().padStart(4, '0')}`;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustBase> {
    const cust = await this.custRepo.findOneBy({ id });
    if (!cust) throw new ResultNotFoundExcept('Customer not found.');

    const updated = Object.assign(cust, {
      ...dto,
      birthday: dto.birthday ? new Date(dto.birthday) : cust.birthday,
    });

    return await this.custRepo.save(updated);
  }
}
