import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { PixWebhookDto } from './dtos/pix-webhook.dto';
import { Payment, PaymentStatus, OrderStatus, PaymentMethod } from '../../../backend/prisma/schema.prisma';
import { OrderService } from '../order/order.service'; // Assuming OrderService is available to update order status

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService, // Inject OrderService to update related orders
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    const { orderId, amount, method } = createPaymentDto;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    if (order.totalAmount.toNumber() !== amount) {
      throw new BadRequestException('Payment amount does not match order total.');
    }

    // Simulate payment initiation with a provider (e.g., Pix via Stripe/Mercado Pago)
    let transactionId: string;
    let qrCode: string | null = null; // For Pix
    let paymentLink: string | null = null; // For other methods

    if (method === PaymentMethod.PIX) {
      // TODO: Integrate with actual Pix API (e.g., Mercado Pago, Stripe)
      // This would involve calling the payment provider's SDK to generate a Pix charge
      // and get the QR code/copy-paste key.
      transactionId = `pix_mock_${Date.now()}`;
      qrCode = `mock_qrcode_for_${orderId}`;
      console.log(`Simulating Pix payment for order ${orderId}. QR Code: ${qrCode}`);
    } else {
      // For other payment methods, integrate with respective APIs
      transactionId = `transaction_mock_${Date.now()}`;
      paymentLink = `mock_payment_link_for_${orderId}`;
      console.log(`Simulating ${method} payment for order ${orderId}. Payment Link: ${paymentLink}`);
    }

    // Record the pending payment in our database
    const payment = await this.prisma.payment.create({
      data: {
        order: { connect: { id: orderId } },
        amount: amount,
        method: method,
        status: PaymentStatus.PENDING,
        transactionId: transactionId,
      },
    });

    // Optionally update the order with the paymentId
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        payment: { connect: { id: payment.id } },
      },
    });

    return {
      paymentId: payment.id,
      transactionId: transactionId,
      qrCode: qrCode,
      paymentLink: paymentLink,
      message: `Payment initiated successfully for order ${orderId}. Waiting for confirmation.`,
    };
  }

  async handlePixWebhook(pixWebhookDto: PixWebhookDto): Promise<Payment> {
    const { transactionId, orderId, status } = pixWebhookDto;

    const existingPayment = await this.prisma.payment.findUnique({
      where: { transactionId: transactionId },
      include: { order: true },
    });

    if (!existingPayment) {
      throw new NotFoundException(`Payment with transaction ID ${transactionId} not found.`);
    }

    // Only process if the status is different or if it's transitioning to COMPLETED
    if (existingPayment.status === PaymentStatus.COMPLETED) {
        console.warn(`Webhook for transaction ${transactionId} already processed as COMPLETED. Skipping.`);
        return existingPayment;
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: existingPayment.id },
      data: {
        status: status,
        paidAt: status === PaymentStatus.COMPLETED ? new Date() : undefined,
      },
    });

    // Update the associated order status if payment is completed
    if (updatedPayment.status === PaymentStatus.COMPLETED && existingPayment.order) {
      await this.orderService.updateOrder(existingPayment.order.id, {
        status: OrderStatus.COMPLETED,
      });
      console.log(`Order ${existingPayment.order.id} status updated to COMPLETED due to successful payment webhook.`);
    } else if (updatedPayment.status === PaymentStatus.FAILED && existingPayment.order) {
        // Optionally handle failed payments (e.g., notify user, update order status to CANCELLED or PENDING_PAYMENT_RETRY)
        await this.orderService.updateOrder(existingPayment.order.id, {
            status: OrderStatus.CANCELLED, // Or a specific failed payment status
        });
        console.log(`Order ${existingPayment.order.id} status updated to CANCELLED due to failed payment webhook.`);
    }

    return updatedPayment;
  }
}
