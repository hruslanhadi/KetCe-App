import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Order, OrderStatus } from '@/common/database/entities';

@Injectable()
export class OrderRepository {
  constructor(@InjectRepository(Order) private readonly repository: Repository<Order>) {}

  async create(order: Partial<Order>): Promise<Order> {
    const newOrder = this.repository.create(order);
    return this.repository.save(newOrder);
  }

  async findById(id: string): Promise<Order | null> {
    return this.repository.findOne({ where: { id }, relations: ['items', 'customer'] });
  }

  async findAll(filter?: {
    status?: OrderStatus;
    source?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Order[]; total: number }> {
    const query = this.repository.createQueryBuilder('order').leftJoinAndSelect('order.items', 'items');

    if (filter?.status) {
      query.where('order.status = :status', { status: filter.status });
    }

    if (filter?.source) {
      query.andWhere('order.source = :source', { source: filter.source });
    }

    const total = await query.getCount();

    const skip = filter?.offset || 0;
    const take = filter?.limit || 10;

    const data = await query.skip(skip).take(take).orderBy('order.created_at', 'DESC').getMany();

    return { data, total };
  }

  async update(id: string, order: Partial<Order>): Promise<Order> {
    await this.repository.update(id, order);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async findByCustomerPhone(phone: string): Promise<Order[]> {
    return this.repository.find({
      where: { customer_phone: phone },
      relations: ['items'],
      order: { created_at: 'DESC' },
    });
  }

  async getOrderStats(): Promise<{
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
  }> {
    const stats = await this.repository
      .createQueryBuilder('order')
      .select('COUNT(order.id)', 'total_orders')
      .addSelect('SUM(order.total_price)', 'total_revenue')
      .addSelect("COUNT(CASE WHEN order.status = 'pending' THEN 1 END)", 'pending_orders')
      .getRawOne();

    return {
      total_orders: parseInt(stats.total_orders) || 0,
      total_revenue: parseFloat(stats.total_revenue) || 0,
      pending_orders: parseInt(stats.pending_orders) || 0,
    };
  }
}
