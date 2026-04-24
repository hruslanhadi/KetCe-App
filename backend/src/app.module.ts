import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { ProductsModule } from '@/modules/products/products.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { WhatsAppModule } from '@/modules/whatsapp/whatsapp.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { InventoryModule } from '@/modules/inventory/inventory.module';
import { PosModule } from '@/modules/pos/pos.module';
import * as entities from '@/common/database/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: Object.values(entities),
        synchronize: true, // Set to false in production and use migrations
        logging: process.env.NODE_ENV !== 'production',
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    WhatsAppModule,
    NotificationsModule,
    InventoryModule,
    PosModule,
  ],
})
export class AppModule {}
