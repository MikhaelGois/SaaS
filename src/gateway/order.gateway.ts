import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { OrderStatus } from '../../../backend/prisma/schema.prisma';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins for development, restrict in production
  },
})
export class OrderGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  // Example: Listen for 'updateOrderStatus' events from clients (e.g., manager, waiter)
  @SubscribeMessage('updateOrderStatus')
  handleOrderStatusUpdate(
    @MessageBody()
    data: { orderId: string; status: OrderStatus },
    @ConnectedSocket() client: Socket,
  ): void {
    // In a real application, you'd want to validate the user, permissions, and update the database here.
    // For now, we'll just emit the update to all connected clients.
    console.log(`Received order status update for order ${data.orderId} to ${data.status}`);
    this.server.emit('orderStatusUpdated', data); // Emit to all clients
  }

  // Method to be called by other services (e.g., OrderService) to emit updates
  emitOrderStatusUpdate(orderId: string, status: OrderStatus) {
    this.server.emit('orderStatusUpdated', { orderId, status });
  }
}
