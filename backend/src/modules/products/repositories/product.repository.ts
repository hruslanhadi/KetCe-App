import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@/common/database/entities';

@Injectable()
export class ProductRepository {
  constructor(@InjectRepository(Product) private readonly repository: Repository<Product>) {}

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.repository.create(product);
    return this.repository.save(newProduct);
  }

  async findById(id: string): Promise<Product | null> {
    return this.repository.findOne({ where: { id }, relations: ['group'] });
  }

  async findAll(filter?: { group_id?: string; is_active?: boolean }): Promise<Product[]> {
    const query = this.repository.createQueryBuilder('product').leftJoinAndSelect('product.group', 'group');

    if (filter?.group_id) {
      query.where('product.group_id = :group_id', { group_id: filter.group_id });
    }

    if (filter?.is_active !== undefined) {
      query.andWhere('product.is_active = :is_active', { is_active: filter.is_active });
    }

    return query.orderBy('product.name', 'ASC').getMany();
  }

  async findByGroupId(groupId: string): Promise<Product[]> {
    return this.repository.find({
      where: { group_id: groupId, is_active: true },
      relations: ['group'],
      order: { name: 'ASC' },
    });
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    await this.repository.update(id, product);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}
