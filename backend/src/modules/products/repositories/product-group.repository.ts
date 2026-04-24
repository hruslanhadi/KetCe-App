import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductGroup } from '@/common/database/entities';

@Injectable()
export class ProductGroupRepository {
  constructor(@InjectRepository(ProductGroup) private readonly repository: Repository<ProductGroup>) {}

  async create(group: Partial<ProductGroup>): Promise<ProductGroup> {
    const newGroup = this.repository.create(group);
    return this.repository.save(newGroup);
  }

  async findById(id: string): Promise<ProductGroup | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<ProductGroup[]> {
    return this.repository.find({ order: { name: 'ASC' } });
  }

  async update(id: string, group: Partial<ProductGroup>): Promise<ProductGroup> {
    await this.repository.update(id, group);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}
