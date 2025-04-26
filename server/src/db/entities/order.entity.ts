// src/db/entities/order.entity.ts
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CustEntity } from './cust.entity'; // Import Customer entity
import { EmployeeEntity } from './emp.entity'; // Import Employee entity
import { OrderItemEntity } from './order-item.entity'; // Import Order Item entity
import { OrderStatus } from 'src/utils/order-status.enum';

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn()
  id: string; // ex. ORD0001 (Consider using UUID here too: @PrimaryGeneratedColumn('uuid'))

  // --- Relationships ---

  @ManyToOne(() => CustEntity, { eager: false, nullable: false }) // An order must have a customer
  @JoinColumn({ name: 'customer_id' }) // Foreign key column name in 'orders' table
  customer: CustEntity;

  @Column() // Explicitly define the column storing the FK
  customer_id: string;

  // Optional: Link to the employee who handled the order
  @ManyToOne(() => EmployeeEntity, { nullable: true, eager: false }) // Order might not have an employee (e.g., online order)
  @JoinColumn({ name: 'employee_id' })
  employee?: EmployeeEntity; // Optional relationship

  @Column({ nullable: true }) // FK column must also be nullable
  employee_id?: string; // Optional FK storage

  // Link to the items within this order
  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    cascade: true, // Automatically save/update/remove items when the order changes
    eager: true, // Load items automatically when loading an order (adjust if needed for performance)
  })
  items: OrderItemEntity[];

  // --- Order Details ---

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING, // Sensible default status
  })
  status: OrderStatus;

  /**
   * Total amount for the entire order.
   * Should be calculated based on the sum of 'total_price' from associated OrderItemEntities.
   * Typically calculated in your service/business logic before saving.
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'text', nullable: true }) // Use 'text' for potentially longer notes
  notes?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
