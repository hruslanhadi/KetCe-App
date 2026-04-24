import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Customer } from './customer.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

export enum DeliveryStatus {
  PENDING = 'pending',
  ON_DELIVERY = 'on_delivery',
  DELIVERED = 'delivered',
}

export enum OrderSource {
  WHATSAPP = 'whatsapp',
  WEB = 'web',
  POS = 'pos',
}

@Entity('orders')
@Index(['customer_id'])
@Index(['source'])
@Index(['status'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  customer_id: string;

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'varchar', length: 255, nullable: false })
  customer_name: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  customer_phone: string;

  @Column({ type: 'enum', enum: OrderSource, default: OrderSource.WEB })
  source: OrderSource;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'enum', enum: DeliveryStatus, default: DeliveryStatus.PENDING })
  delivery_status: DeliveryStatus;

  @Column({ type: 'text', nullable: true })
  delivery_address: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  total_price: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => OrderItem, (item) => item.order, { eager: true, cascade: true })
  items: OrderItem[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
