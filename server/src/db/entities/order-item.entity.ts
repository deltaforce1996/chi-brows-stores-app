// src/db/entities/order-item.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity'; // Adjust path if needed
import { ProductEntity } from './product.entity'; // Import your ProductEntity

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' }) // If order is deleted, delete items
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column()
  order_id: string; // Foreign key column

  @ManyToOne(() => ProductEntity, { eager: false, onDelete: 'RESTRICT' }) // Prevent deleting product if it's in an order item? Or use SET NULL?
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column()
  product_id: string; // Foreign key column

  @Column()
  quantity: number;

  /**
   * Price per unit *at the time the order was placed*.
   * Important to store this separately from the current product price.
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_per_unit: number;

  /**
   * Total price for this line item (quantity * price_per_unit).
   * Stored for convenience and historical accuracy.
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;
}
