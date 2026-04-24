import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { OrderService } from '@/modules/orders/services/order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from '@/modules/orders/dtos/order.dto';
import { OrderSource, OrderStatus } from '@/common/database/entities';

@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto, OrderSource.WEB);
  }

  @Get()
  async getOrders(
    @Query('status') status?: OrderStatus,
    @Query('source') source?: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.orderService.getAllOrders({ status, source, limit, offset });
  }

  @Get('stats')
  async getStats() {
    return this.orderService.getOrderStats();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Put(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(id, updateStatusDto.status as OrderStatus);
  }

  @Get('customer/:phone')
  async getCustomerOrders(@Param('phone') phone: string) {
    return this.orderService.getCustomerOrders(phone);
  }
}
