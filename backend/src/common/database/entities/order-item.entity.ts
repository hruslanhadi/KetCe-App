import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

export enum OrderItemStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  PACKED = 'packed',
  DELIVERED = 'delivered',
}

@Entity('order_items')
@Index(['order_id'])
@Index(['product_id'])
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  order_id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'uuid', nullable: false })
  product_id: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  packing: string;

  @Column({ type: 'text', nullable: true })
  information: string;

  @Column({ type: 'enum', enum: OrderItemStatus, default: OrderItemStatus.PENDING })
  status: OrderItemStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
