import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/db/entities/product.entity';
import {
  BadRequestExcept,
  ResultNotFoundExcept,
} from 'src/errors/exception.error';
import { ProductBase } from 'src/types/product.interface';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    @InjectRepository(ProductEntity) // <-- ใช้ ProductEntity
    private readonly productRepo: Repository<ProductEntity>, // <-- เปลี่ยนชื่อ repo
  ) {}

  async onModuleInit() {
    // This method will be called when the module is initialized
    await this.register({
      name: 'Product A',
      price: 100,
      description: 'Description for Product A',
      image: 'images/product_a.jpg',
    }).catch(() => {
      console.error('Failed to register default product');
    });
    await this.register({
      name: 'Product B',
      price: 50,
      description: 'Description for Product B',
      image: 'images/product_b.png',
    }).catch(() => {
      console.error('Failed to register default product');
    });
    await this.register({
      name: 'Product C (No Desc)',
      price: 500,
      description: 'description/test',
      image: 'image/test',
    }).catch(() => {
      console.error('Failed to register default product');
    });
  }

  async register(dto: CreateProductDto): Promise<ProductBase> {
    // ตรวจสอบว่ามีสินค้าชื่อนี้อยู่แล้วหรือไม่
    const exists = await this.productRepo.findOne({
      where: { name: dto.name }, // ตรวจสอบเฉพาะชื่อสินค้า
    });

    if (exists) {
      throw new BadRequestExcept('มีสินค้าชื่อนี้อยู่แล้ว');
    }

    // หา id ล่าสุด
    const last = await this.productRepo
      .createQueryBuilder('product') // ใช้ alias 'product'
      .orderBy('product.id', 'DESC')
      .limit(1)
      .getOne();

    const nextId = this.generateNextId(last?.id);

    const newProduct = this.productRepo.create({
      ...dto,
      id: nextId,
    });

    const saved = await this.productRepo.save(newProduct);
    return saved as ProductBase;
  }

  async getById(id: string): Promise<ProductBase> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new ResultNotFoundExcept('Product not found.');
    return product;
  }

  async searchProduct(query: string): Promise<ProductBase[]> {
    // ค้นหาจากชื่อสินค้า
    const result = await this.productRepo.find({
      where: [{ name: ILike(`%${query}%`) }],
    });
    // ไม่ต้อง throw error ถ้าหาไม่เจอ อาจจะคืนค่าเป็น array ว่างก็ได้ แล้วแต่ requirement
    if (result && result.length === 0)
      throw new ResultNotFoundExcept('Product not found.');
    return result;
  }

  private generateNextId(lastId?: string): string {
    // ใช้ Prefix 'P' สำหรับ Product
    const prefix = 'P';
    if (!lastId) return `${prefix}0001`;
    const num = parseInt(lastId.replace(prefix, ''), 10) + 1;
    return `${prefix}${num.toString().padStart(4, '0')}`;
  }
}
