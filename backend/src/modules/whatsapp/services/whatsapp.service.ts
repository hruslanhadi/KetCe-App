import { Injectable, Logger } from '@nestjs/common';
import { OrderService } from '@/modules/orders/services/order.service';
import { ProductService } from '@/modules/products/services/product.service';
import { OrderSource, OrderStatus } from '@/common/database/entities';

interface WhatsAppMessage {
  from: string;
  body: string;
}

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  /**
   * Parse WhatsApp message and route to appropriate handler
   * WhatsApp Module acts ONLY as an adapter - no business logic here
   */
  async handleIncomingMessage(message: WhatsAppMessage): Promise<string> {
    const text = message.body.toLowerCase().trim();
    const senderPhone = message.from;

    this.logger.debug(`Received message from ${senderPhone}: ${text}`);

    // Menu command
    if (text === 'menu') {
      return this.handleMenuCommand();
    }

    // Order command: "order <product> <quantity>"
    if (text.startsWith('order ')) {
      return await this.handleOrderCommand(text, senderPhone);
    }

    // Default response
    return 'I did not understand that. Type "menu" for available products or "order <product> <quantity>"';
  }

  /**
   * Handle menu request
   */
  private async handleMenuCommand(): Promise<string> {
    const groups = await this.productService.getProductGroups();
    const products = await this.productService.getAllProducts();

    if (products.length === 0) {
      return 'No products available at the moment.';
    }

    let menuText = '📋 *Menu*\n\n';

    for (const group of groups) {
      const groupProducts = products.filter((p) => p.group_id === group.id);
      if (groupProducts.length > 0) {
        menuText += `*${group.name}*\n`;
        for (const product of groupProducts) {
          menuText += `• ${product.name} - ₹${product.price}\n`;
        }
        menuText += '\n';
      }
    }

    menuText += 'Reply with: order <product name> <quantity>\nExample: order Nasi Kuning 2';
    return menuText;
  }

  /**
   * Handle order command
   * Format: "order <product_name> <quantity>"
   */
  private async handleOrderCommand(text: string, senderPhone: string): Promise<string> {
    try {
      const parts = text.substring(6).trim().split(/\s+/);

      if (parts.length < 2) {
        return 'Please specify product and quantity.\nExample: order Nasi Kuning 2';
      }

      const quantity = parseInt(parts[parts.length - 1]);
      const productName = parts.slice(0, -1).join(' ');

      if (isNaN(quantity) || quantity < 1) {
        return 'Invalid quantity. Please enter a number.';
      }

      // Find product by name
      const allProducts = await this.productService.getAllProducts();
      const product = allProducts.find((p) => p.name.toLowerCase().includes(productName.toLowerCase()));

      if (!product) {
        return `Product "${productName}" not found. Type "menu" to see available products.`;
      }

      // Call OrderService to create order
      // This is where the WhatsApp module calls into business logic
      const order = await this.orderService.createOrder(
        {
          customer_name: 'WhatsApp User', // Can be enhanced with customer name
          customer_phone: senderPhone,
          notes: `Order from WhatsApp`,
          items: [
            {
              product_id: product.id,
              quantity,
            },
          ],
          source: OrderSource.WHATSAPP,
        },
        OrderSource.WHATSAPP,
      );

      return `✅ Order confirmed!\nOrder ID: ${order.id.substring(0, 8)}\nTotal: ₹${order.total_price}\nYou will be notified when ready.`;
    } catch (error) {
      this.logger.error(`Error processing order: ${error.message}`);
      return 'Failed to create order. Please try again.';
    }
  }
}
