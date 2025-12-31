import { IsEnum, IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { PaymentStatus } from '../../../backend/prisma/schema.prisma';

export class PixWebhookDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string; // Unique ID from the payment provider

  @IsString()
  @IsNotEmpty()
  orderId: string; // Our internal order ID

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsString()
  @IsOptional()
  paymentProvider?: string; // e.g., 'Stripe', 'MercadoPago'
}
