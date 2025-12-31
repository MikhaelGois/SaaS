import { Module } from '@nestjs/common';
import { OrderGateway } from './order.gateway';

@Module({
  providers: [OrderGateway],
  exports: [OrderGateway], // Export if other modules need to access it (e.g., OrderService to emit events)
})
export class GatewayModule {}
