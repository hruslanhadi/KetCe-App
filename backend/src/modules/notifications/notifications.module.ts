import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from '@/modules/notifications/services/notification.service';
import { NotificationProcessor } from '@/modules/notifications/queues/notification.processor';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        name: 'notifications',
        redis: {
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT') || 6379,
        },
      }),
    }),
  ],
  providers: [NotificationService, NotificationProcessor],
  exports: [NotificationService],
})
export class NotificationsModule {}
