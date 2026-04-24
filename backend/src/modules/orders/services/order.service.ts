import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';
import { CustomerRepository } from '@/modules/users/repositories/customer.repository';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { OrderSource, OrderStatus } from '@/common/database/entities';
import { CreateOrderDto } from '@/modules/orders/dtos/order.dto';
import { EventBus } from '@/common/events/event-bus';
import { OrderCreatedEvent, OrderUpdatedEvent } from '@/common/events/order.events';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly productRepository: ProductRepository,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Create order from any channel (WhatsApp, Web, POS)
   * Multi-channel order entry point - all orders go through here
   */
  async createOrder(createOrderDto: CreateOrderDto, source: OrderSource) {
    // Find or create customer
    const customer = await this.customerRepository.findOrCreate(
      createOrderDto.customer_phone,
      createOrderDto.customer_name,
    );

    let totalPrice = 0;
    const orderItems = [];

    // Calculate total and prepare items
    for (const item of createOrderDto.items) {
      const product = await this.productRepository.findById(item.product_id);
      if (!product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
        packing: item.packing,
        information: item.information,
      });
    }

    // Create order
    const order = await this.orderRepository.create({
      id: uuid(),
      customer_id: customer.id,
      customer_name: customer.name,
      customer_phone: customer.phone,
      source,
      status: OrderStatus.PENDING,
      total_price: totalPrice,
      delivery_address: createOrderDto.delivery_address || customer.address,
      notes: createOrderDto.notes,
      items: orderItems,
    });

    // Publish event for notifications and other async tasks
    await this.eventBus.publish(new OrderCreatedEvent(order.id, { order, source }));

    return order;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    const order = await this.orderRepository.update(orderId, { status: newStatus });

    // Publish event
    await this.eventBus.publish(new OrderUpdatedEvent(orderId, { status: newStatus }));

    return order;
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string) {
    return this.orderRepository.findById(orderId);
  }

  /**
   * Get all orders with filters
   */
  async getAllOrders(filter?: {
    status?: OrderStatus;
    source?: string;
    limit?: number;
    offset?: number;
  }) {
    return this.orderRepository.findAll(filter);
  }

  /**
   * Get customer order history
   */
  async getCustomerOrders(phone: string) {
    return this.orderRepository.findByCustomerPhone(phone);
  }

  /**
   * Get order statistics
   */
  async getOrderStats() {
    return this.orderRepository.getOrderStats();
  }
}
