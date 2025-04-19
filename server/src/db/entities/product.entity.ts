// src/db/entities/product.entity.ts
import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  // <--- แก้ไขชื่อคลาสตรงนี้
  @PrimaryColumn()
  id: string; // ex. P0001

  @Column({ unique: true })
  name: string;

  // ราคาไม่ควร unique นะครับ สินค้าคนละตัวอาจมีราคาเท่ากันได้
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) // ใช้ decimal สำหรับราคา
  price: number;

  @Column({ nullable: true }) // อาจจะไม่มี description ก็ได้
  description: string;

  @Column({ nullable: true }) // อาจจะไม่มี image ก็ได้
  image: string;

  @CreateDateColumn()
  created_at: Date;
}
