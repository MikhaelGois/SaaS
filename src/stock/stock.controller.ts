import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../../backend/prisma/schema.prisma';
import { CreateIngredientDto } from './dtos/create-ingredient.dto';
import { UpdateIngredientDto } from './dtos/update-ingredient.dto';
import { CreateProductIngredientDto } from './dtos/create-product-ingredient.dto';
import { UpdateProductIngredientDto } from './dtos/update-product-ingredient.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  // Ingredient Endpoints
  @Post('ingredients')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createIngredient(@Body() createIngredientDto: CreateIngredientDto) {
    return this.stockService.createIngredient(createIngredientDto);
  }

  @Get('ingredients')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.CASHIER, UserRole.WAITER)
  findAllIngredients() {
    return this.stockService.findAllIngredients();
  }

  @Get('ingredients/:id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.CASHIER, UserRole.WAITER)
  findOneIngredient(@Param('id') id: string) {
    return this.stockService.findOneIngredient(id);
  }

  @Patch('ingredients/:id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  updateIngredient(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.stockService.updateIngredient(id, updateIngredientDto);
  }

  @Delete('ingredients/:id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeIngredient(@Param('id') id: string) {
    return this.stockService.removeIngredient(id);
  }

  // Product-Ingredient Endpoints
  @Post('products/:productId/ingredients')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  addProductIngredient(
    @Param('productId') productId: string,
    @Body() createProductIngredientDto: Omit<CreateProductIngredientDto, 'productId'>, // Omit productId as it's from param
  ) {
    return this.stockService.addProductIngredient({ ...createProductIngredientDto, productId });
  }

  @Patch('products/:productId/ingredients/:ingredientId')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  updateProductIngredient(
    @Param('productId') productId: string,
    @Param('ingredientId') ingredientId: string,
    @Body() updateProductIngredientDto: UpdateProductIngredientDto,
  ) {
    return this.stockService.updateProductIngredient(productId, ingredientId, updateProductIngredientDto);
  }

  @Delete('products/:productId/ingredients/:ingredientId')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeProductIngredient(
    @Param('productId') productId: string,
    @Param('ingredientId') ingredientId: string,
  ) {
    return this.stockService.removeProductIngredient(productId, ingredientId);
  }

  // Stock Alert Endpoint
  @Post('alerts/check')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  checkStockAlerts() {
    return this.stockService.checkStockAlerts();
  }
}
