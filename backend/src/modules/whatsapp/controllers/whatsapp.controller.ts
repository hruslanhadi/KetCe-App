import { Controller, Post, Body, Logger } from '@nestjs/common';
import { WhatsAppService } from '@/modules/whatsapp/services/whatsapp.service';

@Controller('api/whatsapp')
export class WhatsAppController {
  private readonly logger = new Logger(WhatsAppController.name);

  constructor(private readonly whatsAppService: WhatsAppService) {}

  @Post('webhook')
  async handleWebhook(@Body() body: any): Promise<{ message: string }> {
    const { from, body: messageBody } = body;

    this.logger.log(`Webhook received from ${from}`);

    const response = await this.whatsAppService.handleIncomingMessage({
      from,
      body: messageBody,
    });

    // TODO: Send response back via WhatsApp API
    // For now, just return the response

    return { message: response };
  }
}
