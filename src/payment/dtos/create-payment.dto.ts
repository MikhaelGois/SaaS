import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { PaymentMethod } from '../../../backend/prisma/schema.prisma';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}
