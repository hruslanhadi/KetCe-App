import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '@/common/database/entities';

@Injectable()
export class CustomerRepository {
  constructor(@InjectRepository(Customer) private readonly repository: Repository<Customer>) {}

  async create(customer: Partial<Customer>): Promise<Customer> {
    const newCustomer = this.repository.create(customer);
    return this.repository.save(newCustomer);
  }

  async findById(id: string): Promise<Customer | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return this.repository.findOne({ where: { phone } });
  }

  async findAll(): Promise<Customer[]> {
    return this.repository.find({ order: { created_at: 'DESC' } });
  }

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    await this.repository.update(id, customer);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async findOrCreate(phone: string, name: string): Promise<Customer> {
    let customer = await this.findByPhone(phone);
    if (!customer) {
      customer = await this.create({ phone, name });
    }
    return customer;
  }
}
