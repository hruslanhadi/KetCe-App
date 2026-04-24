import { Module } from '@nestjs/common';
import { WhatsAppService } from '@/modules/whatsapp/services/whatsapp.service';
import { WhatsAppController } from '@/modules/whatsapp/controllers/whatsapp.controller';
import { OrdersModule } from '@/modules/orders/orders.module';
import { ProductsModule } from '@/modules/products/products.module';

@Module({
  imports: [OrdersModule, ProductsModule],
  providers: [WhatsAppService],
  controllers: [WhatsAppController],
})
export class WhatsAppModule {}
