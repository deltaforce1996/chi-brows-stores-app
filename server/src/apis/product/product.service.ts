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
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async onModuleInit() {
    // Default products
    await this.register({
      name: 'สักคิ้วฝุ่น',
      price: 100,
      description: 'สักคิ้วฝุ่น',
      image: 'สักคิ้วฝุ่น.png',
    }).catch(() => {
      console.error('Failed to register default product: สักคิ้วฝุ่น');
    });

    await this.register({
      name: 'สักคิ้วผสม',
      price: 500,
      description: 'สักคิ้วผสม',
      image: 'สักคิ้วผสม.png',
    }).catch(() => {
      console.error('Failed to register default product: สักคิ้วผสม');
    });

    await this.register({
      name: 'สักคิ้วลายเส้น',
      price: 500,
      description: 'สักคิ้วลายเส้น',
      image: 'สักคิ้วลายเส้น.png',
    }).catch(() => {
      console.error('Failed to register default product: สักคิ้วลายเส้น');
    });

    await this.register({
      name: 'สักคิ้วเฉดดิ้ง',
      price: 400,
      description: 'สักคิ้วเฉดดิ้ง',
      image: 'สักคิ้วเฉดดิ้ง.png',
    }).catch(() => {
      console.error('Failed to register default product: สักคิ้วเฉดดิ้ง');
    });

    await this.register({
      name: 'ฝังสีปาก',
      price: 800,
      description: 'ฝังสีปาก',
      image: 'ฝังสีปาก.png',
    }).catch(() => {
      console.error('Failed to register default product: ฝังสีปาก');
    });

    await this.register({
      name: 'สักไรผม',
      price: 700,
      description: 'สักไรผม',
      image: 'สักไรผม.png',
    }).catch(() => {
      console.error('Failed to register default product: สักไรผม');
    });

    await this.register({
      name: 'สักไฝมงคล',
      price: 300,
      description: 'สักไฝมงคล',
      image: 'สักไฝมงคล.png',
    }).catch(() => {
      console.error('Failed to register default product: สักไฝมงคล');
    });

    await this.register({
      name: 'สักขอบตา',
      price: 600,
      description: 'สักขอบตา',
      image: 'สักขอบตา.png',
    }).catch(() => {
      console.error('Failed to register default product: สักขอบตา');
    });

    await this.register({
      name: 'เลเซอร์ลบคิ้ว',
      price: 500,
      description: 'เลเซอร์ลบคิ้ว',
      image: 'เลเซอร์ลบคิ้ว.png',
    }).catch(() => {
      console.error('Failed to register default product: เลเซอร์ลบคิ้ว');
    });

    await this.register({
      name: 'เลเซอร์ลบรอยสัก',
      price: 1000,
      description: 'เลเซอร์ลบรอยสัก',
      image: 'เลเซอร์ลบรอยสัก.png',
    }).catch(() => {
      console.error('Failed to register default product: เลเซอร์ลบรอยสัก');
    });

    await this.register({
      name: 'ต่อขนตา',
      price: 300,
      description: 'ต่อขนตา',
      image: 'ต่อขนตา.png',
    }).catch(() => {
      console.error('Failed to register default product: ต่อขนตา');
    });

    await this.register({
      name: 'ลิฟท์ติ้งขนตา',
      price: 350,
      description: 'ลิฟท์ติ้งขนตา',
      image: 'ลิฟท์ติ้งขนตา.png',
    }).catch(() => {
      console.error('Failed to register default product: ลิฟท์ติ้งขนตา');
    });

    await this.register({
      name: 'ทำเล็บเจล',
      price: 250,
      description: 'ทำเล็บเจล',
      image: 'ทำเล็บเจล.png',
    }).catch(() => {
      console.error('Failed to register default product: ทำเล็บเจล');
    });

    await this.register({
      name: 'แว็กซ์ขน',
      price: 200,
      description: 'แว็กซ์ขน',
      image: 'แว็กซ์ขน.png',
    }).catch(() => {
      console.error('Failed to register default product: แว็กซ์ขน');
    });

    await this.register({
      name: 'จี้ไฝ',
      price: 150,
      description: 'จี้ไฝ',
      image: 'จี้ไฝ.png',
    }).catch(() => {
      console.error('Failed to register default product: จี้ไฝ');
    });
  }

  async register(dto: CreateProductDto): Promise<ProductBase> {
    const exists = await this.productRepo.findOne({
      where: { name: dto.name },
    });

    if (exists) {
      throw new BadRequestExcept('มีสินค้าชื่อนี้อยู่แล้ว');
    }

    const last = await this.productRepo
      .createQueryBuilder('product')
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
    const result = await this.productRepo.find({
      where: [{ name: ILike(`%${query}%`) }],
    });
    if (result && result.length === 0)
      throw new ResultNotFoundExcept('Product not found.');
    return result;
  }

  private generateNextId(lastId?: string): string {
    const prefix = 'P';
    if (!lastId) return `${prefix}0001`;
    const num = parseInt(lastId.replace(prefix, ''), 10) + 1;
    return `${prefix}${num.toString().padStart(4, '0')}`;
  }
}
