import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly WHATSAPP_API_URL = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`; // Replace with your phone ID

  constructor(private readonly httpService: HttpService) {}

  async sendMessage(to: string, message: string): Promise<any> {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN; // Your WhatsApp Cloud API access token

    if (!accessToken) {
      this.logger.error('WhatsApp Access Token not configured.');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: {
        body: message,
      },
    };

    try {
      this.logger.log(`Sending WhatsApp message to ${to}: ${message}`);
      const { data } = await firstValueFrom(
        this.httpService.post(this.WHATSAPP_API_URL, payload, { headers }),
      );
      this.logger.log('WhatsApp message sent successfully:', data);
      return data;
    } catch (error) {
      this.logger.error('Failed to send WhatsApp message.', error.response?.data || error.message);
      // You might want to throw an exception or handle it differently based on your error strategy
      return { error: 'Failed to send WhatsApp message', details: error.response?.data || error.message };
    }
  }

  // Example for sending a templated message (more common for transactional messages)
  async sendTemplatedMessage(
    to: string,
    templateName: string,
    components: any[], // e.g., [{ type: "body", parameters: [{ type: "text", text: "Value" }] }]
    languageCode: string = 'pt_BR',
  ): Promise<any> {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!accessToken) {
      this.logger.error('WhatsApp Access Token not configured.');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        components: components,
      },
    };

    try {
      this.logger.log(`Sending WhatsApp template message '${templateName}' to ${to}.`);
      const { data } = await firstValueFrom(
        this.httpService.post(this.WHATSAPP_API_URL, payload, { headers }),
      );
      this.logger.log('WhatsApp template message sent successfully:', data);
      return data;
    } catch (error) {
      this.logger.error(
        'Failed to send WhatsApp template message.',
        error.response?.data || error.message,
      );
      return { error: 'Failed to send WhatsApp template message', details: error.response?.data || error.message };
    }
  }
}
