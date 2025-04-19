import { InjectRepository } from '@nestjs/typeorm';
import { CustEntity } from 'src/db/entities/cust.entity';
import { ILike, Repository } from 'typeorm';
import { CreatCustomerDto } from './dtos/customer.dto';
import { CustBase } from 'src/types/cust.interface';
import {
  BadRequestExcept,
  ResultNotFoundExcept,
} from 'src/errors/exception.error';
import { Injectable } from '@nestjs/common';

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
        { tel: dto.tel },
        { line: dto.line },
        { facebook: dto.facebook },
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
      .createQueryBuilder('emp')
      .orderBy('emp.id', 'DESC')
      .limit(1)
      .getOne();

    const nextId = this.generateNextId(last?.id);

    const newCust = this.custRepo.create({
      ...dto,
      id: nextId,
      birthday: new Date(dto.birthday),
    });

    const saved = await this.custRepo.save(newCust);
    return saved as CustBase;
  }

  async getById(id: string): Promise<CustBase> {
    const cust = await this.custRepo.findOneBy({ id });
    if (!cust) throw new ResultNotFoundExcept('Cust not found.');
    return cust;
  }

  async searchUser(query: string): Promise<CustBase[]> {
    const result = await this.custRepo.find({
      where: [
        { nickname: ILike(`%${query}%`) },
        { fullname: ILike(`%${query}%`) },
      ],
    });
    if (result && result.length === 0)
      throw new ResultNotFoundExcept('Cust not found.');
    return result;
  }

  private generateNextId(lastId?: string): string {
    if (!lastId) return 'CUST0001';
    const num = parseInt(lastId.replace('CUST', ''), 10) + 1;
    return `CUST${num.toString().padStart(4, '0')}`;
  }
}
