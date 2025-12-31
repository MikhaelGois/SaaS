import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assuming this guard exists
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../../backend/prisma/schema.prisma';

@UseGuards(JwtAuthGuard, RolesGuard) // Apply guards to all routes in this controller
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(UserRole.WAITER, UserRole.CASHIER, UserRole.MANAGER)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.orderService.createOrder(createOrderDto, req.user.userId);
  }

  @Get()
  @Roles(UserRole.WAITER, UserRole.CASHIER, UserRole.MANAGER, UserRole.ADMIN)
  findAll() {
    return this.orderService.findAllOrders();
  }

  @Get(':id')
  @Roles(UserRole.WAITER, UserRole.CASHIER, UserRole.MANAGER, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.orderService.findOneOrder(id);
  }

  @Patch(':id')
  @Roles(UserRole.WAITER, UserRole.CASHIER, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.orderService.removeOrder(id);
  }
}
