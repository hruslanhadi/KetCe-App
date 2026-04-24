import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { IEventListener } from '@/common/events/event-bus';

@Injectable()
export class NotificationService implements IEventListener {
  constructor(@InjectQueue('notifications') private readonly notificationQueue: Queue) {}

  async sendWhatsAppNotification(phone: string, message: string): Promise<Job> {
    return this.notificationQueue.add(
      'send-whatsapp',
      { phone, message },
      {
        delay: 1000, // 1 second delay
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );
  }

  async sendEmail(email: string, subject: string, body: string): Promise<Job> {
    return this.notificationQueue.add('send-email', { email, subject, body }, { attempts: 2 });
  }

  async handle(event: any): Promise<void> {
    if (event.type === 'order.created') {
      const { order, source } = event.data;

      // Send notification based on order source
      if (source === 'whatsapp' || source === 'web') {
        const message = `Order #${order.id.substring(0, 8)} confirmed! Total: ₹${order.total_price}. You will be notified when your order is ready.`;
        await this.sendWhatsAppNotification(order.customer_phone, message);
      }
    }

    if (event.type === 'order.updated') {
      const { orderId } = event;
      // Can be extended to send status update notifications
    }
  }
}
