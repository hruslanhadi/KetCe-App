import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductService } from '@/modules/products/services/product.service';
import { CreateProductDto, UpdateProductDto } from '@/modules/products/dtos/product.dto';
import { CreateProductGroupDto, UpdateProductGroupDto } from '@/modules/products/dtos/product-group.dto';

@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async getProducts() {
    return this.productService.getAllProducts();
  }

  @Get('group/:groupId')
  async getProductsByGroup(@Param('groupId') groupId: string) {
    return this.productService.getAllProducts(groupId);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}

@Controller('api/product-groups')
export class ProductGroupController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createGroup(@Body() createGroupDto: CreateProductGroupDto) {
    return this.productService.createProductGroup(createGroupDto.name);
  }

  @Get()
  async getGroups() {
    return this.productService.getProductGroups();
  }

  @Get(':id')
  async getGroupById(@Param('id') id: string) {
    return this.productService.getProductGroupById(id);
  }

  @Put(':id')
  async updateGroup(@Param('id') id: string, @Body() updateGroupDto: UpdateProductGroupDto) {
    return this.productService.updateProductGroup(id, updateGroupDto.name);
  }

  @Delete(':id')
  async deleteGroup(@Param('id') id: string) {
    return this.productService.deleteProductGroup(id);
  }
}
