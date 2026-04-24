import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem } from '@/common/database/entities';
import { OrderService } from '@/modules/orders/services/order.service';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';
import { OrderController } from '@/modules/orders/controllers/order.controller';
import { UsersModule } from '@/modules/users/users.module';
import { ProductsModule } from '@/modules/products/products.module';
import { EventBus } from '@/common/events/event-bus';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), UsersModule, ProductsModule],
  providers: [OrderService, OrderRepository, EventBus],
  controllers: [OrderController],
  exports: [OrderService, OrderRepository, EventBus],
})
export class OrdersModule {}
