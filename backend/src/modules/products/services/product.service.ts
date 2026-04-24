import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { ProductGroupRepository } from '@/modules/products/repositories/product-group.repository';
import { CreateProductDto, UpdateProductDto } from '@/modules/products/dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productGroupRepository: ProductGroupRepository,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    return this.productRepository.create(createProductDto);
  }

  async getProductById(id: string) {
    return this.productRepository.findById(id);
  }

  async getAllProducts(groupId?: string) {
    if (groupId) {
      return this.productRepository.findByGroupId(groupId);
    }
    return this.productRepository.findAll({ is_active: true });
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  async deleteProduct(id: string) {
    return this.productRepository.delete(id);
  }

  // Product Groups
  async createProductGroup(name: string) {
    return this.productGroupRepository.create({ name });
  }

  async getProductGroups() {
    return this.productGroupRepository.findAll();
  }

  async getProductGroupById(id: string) {
    return this.productGroupRepository.findById(id);
  }

  async updateProductGroup(id: string, name: string) {
    return this.productGroupRepository.update(id, { name });
  }

  async deleteProductGroup(id: string) {
    return this.productGroupRepository.delete(id);
  }
}
