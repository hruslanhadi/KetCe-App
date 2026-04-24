import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@/modules/users/repositories/customer.repository';
import { CreateCustomerDto, UpdateCustomerDto } from '@/modules/users/dtos/customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    return this.customerRepository.create(createCustomerDto);
  }

  async getCustomerById(id: string) {
    return this.customerRepository.findById(id);
  }

  async getCustomerByPhone(phone: string) {
    return this.customerRepository.findByPhone(phone);
  }

  async getAllCustomers() {
    return this.customerRepository.findAll();
  }

  async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto) {
    return this.customerRepository.update(id, updateCustomerDto);
  }

  async deleteCustomer(id: string) {
    return this.customerRepository.delete(id);
  }
}
