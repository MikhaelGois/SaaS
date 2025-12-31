import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order, OrderStatus } from '../../../backend/prisma/schema.prisma';
import { OrderGateway } from '../gateway/order.gateway';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { RedisService } from '../redis/redis.service'; // Import RedisService // Import WhatsappService

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private orderGateway: OrderGateway,
    private whatsappService: WhatsappService,
    private redisService: RedisService, // Inject RedisService
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId?: string): Promise<Order> {
    const { items, ...rest } = createOrderDto;

    // Calculate total amount
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      const itemPrice = product.price.toNumber(); // Convert Decimal to number
      totalAmount += itemPrice * item.quantity;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    const newOrder = await this.prisma.order.create({
      data: {
        ...rest,
        userId: userId,
        totalAmount: totalAmount,
        items: {
          createMany: {
            data: orderItemsData,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true,
        table: true,
      },
    });

    // Emit WebSocket event for new order
    this.orderGateway.emitOrderStatusUpdate(newOrder.id, newOrder.status);

    // Send WhatsApp confirmation
    if (newOrder.customerPhone) {
      const orderSummary = newOrder.items.map(item => `${item.quantity}x ${item.product.name}`).join(', ');
      const message = `Olá ${newOrder.customerName || ''}! Seu pedido #${newOrder.orderNumber} foi recebido com sucesso. Itens: ${orderSummary}. Total: R$ ${newOrder.totalAmount.toFixed(2)}. Status: ${newOrder.status}.`;
      await this.whatsappService.sendMessage(newOrder.customerPhone, message);
    }

    // Enqueue order for kitchen processing
    await this.redisService.enqueue('kitchen_orders', { orderId: newOrder.id, status: newOrder.status });

    return newOrder;
  }

  async findAllOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        items: true,
        user: true,
        table: true,
      },
    });
  }

  async findOneOrder(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: true,
        table: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true,
        table: true,
      },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }

    const { items, status, ...rest } = updateOrderDto; // Destructure status

    let updatedOrder: Order;

    // If items are provided, recalculate total and update order items
    if (items) {
      let totalAmount = 0;
      const orderItemsData = [];

      // Remove existing items
      await this.prisma.orderItem.deleteMany({
        where: { orderId: id },
      });

      for (const item of items) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        const itemPrice = product.price.toNumber();
        totalAmount += itemPrice * item.quantity;

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: itemPrice,
          orderId: id, // Explicitly link to the order being updated
        });
      }

      updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          ...rest,
          totalAmount: totalAmount,
          status: status, // Update status if provided
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: true,
          table: true,
        },
      });
    } else {
      updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          ...rest,
          status: status, // Update status if provided
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: true,
          table: true,
        },
      });
    }

    // Emit WebSocket event if status has changed
    if (status && updatedOrder.status !== existingOrder.status) {
      this.orderGateway.emitOrderStatusUpdate(updatedOrder.id, updatedOrder.status);

      // Send WhatsApp notification for status change
      if (updatedOrder.customerPhone) {
        let message = `Olá ${updatedOrder.customerName || ''}! O status do seu pedido #${updatedOrder.orderNumber} mudou para: ${updatedOrder.status}.`;
        if (updatedOrder.status === OrderStatus.READY) {
          message += ` Está pronto para retirada/servir!`;
        } else if (updatedOrder.status === OrderStatus.COMPLETED) {
            message += ` Pagamento confirmado. Obrigado!`;
        }
        await this.whatsappService.sendMessage(updatedOrder.customerPhone, message);
      }
    } else if (status && updatedOrder.status === existingOrder.status) {
        // Even if status didn't change, if status was explicitly set, re-emit/re-confirm
        this.orderGateway.emitOrderStatusUpdate(updatedOrder.id, updatedOrder.status);
    }


    return updatedOrder;
  }

  async removeOrder(id: string): Promise<Order> {
    const existingOrder = await this.prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }

    // Delete associated order items first due to foreign key constraints
    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    const deletedOrder = await this.prisma.order.delete({
      where: { id },
    });

    // Emit WebSocket event for removed order (e.g., status CANCELLED)
    this.orderGateway.emitOrderStatusUpdate(deletedOrder.id, OrderStatus.CANCELLED);

    // Send WhatsApp notification for cancelled order
    if (existingOrder.customerPhone) {
      const message = `Olá ${existingOrder.customerName || ''}! Seu pedido #${existingOrder.orderNumber} foi cancelado.`;
      await this.whatsappService.sendMessage(existingOrder.customerPhone, message);
    }

    return deletedOrder;
  }
}
