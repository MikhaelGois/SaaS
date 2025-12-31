import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { PixWebhookDto } from './dtos/pix-webhook.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../../backend/prisma/schema.prisma';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @UseGuards(JwtAuthGuard, RolesGuard) // Only authenticated cashiers/managers can initiate payments
  @Roles(UserRole.CASHIER, UserRole.MANAGER)
  @HttpCode(HttpStatus.OK)
  initiatePayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  // Webhook endpoint for Pix payments (e.g., from Mercado Pago or Stripe for Pix)
  // This endpoint typically should NOT be protected by JWT, as the payment provider calls it.
  // Instead, it should use a webhook secret for verification.
  @Post('webhook/pix')
  @HttpCode(HttpStatus.OK)
  async handlePixWebhook(
    @Body() pixWebhookDto: PixWebhookDto,
    @Headers('stripe-signature') signature?: string, // Example for Stripe
    @Req() req?: RawBodyRequest<Request>, // For raw body access for signature verification
  ) {
    // TODO: Implement webhook signature verification here
    // For example, if using Stripe:
    // try {
    //   const event = this.stripeService.constructEvent(req.rawBody, signature, 'your_webhook_secret');
    //   if (event.type === 'pix.payment_succeeded') {
    //     // Process event.data.object
    //   }
    // } catch (err) {
    //   throw new BadRequestException(`Webhook Error: ${err.message}`);
    // }

    console.log('Received Pix Webhook:', pixWebhookDto);
    return this.paymentService.handlePixWebhook(pixWebhookDto);
  }
}
