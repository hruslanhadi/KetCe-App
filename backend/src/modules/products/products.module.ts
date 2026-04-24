import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductGroup } from '@/common/database/entities';
import { ProductService } from '@/modules/products/services/product.service';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { ProductGroupRepository } from '@/modules/products/repositories/product-group.repository';
import { ProductController, ProductGroupController } from '@/modules/products/controllers/product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductGroup])],
  providers: [ProductService, ProductRepository, ProductGroupRepository],
  controllers: [ProductController, ProductGroupController],
  exports: [ProductService, ProductRepository, ProductGroupRepository],
})
export class ProductsModule {}
