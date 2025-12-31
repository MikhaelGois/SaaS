import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto } from './dtos/create-ingredient.dto';
import { UpdateIngredientDto } from './dtos/update-ingredient.dto';
import { CreateProductIngredientDto } from './dtos/create-product-ingredient.dto';
import { UpdateProductIngredientDto } from './dtos/update-product-ingredient.dto';
import { Ingredient, ProductIngredient } from '../../../backend/prisma/schema.prisma';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  // Ingredient Management
  async createIngredient(data: CreateIngredientDto): Promise<Ingredient> {
    try {
      return await this.prisma.ingredient.create({ data });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Ingredient with name "${data.name}" already exists.`);
      }
      throw error;
    }
  }

  async findAllIngredients(): Promise<Ingredient[]> {
    return this.prisma.ingredient.findMany();
  }

  async findOneIngredient(id: string): Promise<Ingredient> {
    const ingredient = await this.prisma.ingredient.findUnique({ where: { id } });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found.`);
    }
    return ingredient;
  }

  async updateIngredient(id: string, data: UpdateIngredientDto): Promise<Ingredient> {
    const ingredient = await this.findOneIngredient(id); // Check existence
    try {
      return await this.prisma.ingredient.update({ where: { id }, data });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Ingredient with name "${data.name}" already exists.`);
      }
      throw error;
    }
  }

  async removeIngredient(id: string): Promise<Ingredient> {
    const ingredient = await this.findOneIngredient(id); // Check existence
    await this.prisma.productIngredient.deleteMany({ where: { ingredientId: id } }); // Remove associations
    return this.prisma.ingredient.delete({ where: { id } });
  }

  // Product-Ingredient Management
  async addProductIngredient(data: CreateProductIngredientDto): Promise<ProductIngredient> {
    const { productId, ingredientId } = data;

    // Check if product and ingredient exist
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }
    const ingredient = await this.prisma.ingredient.findUnique({ where: { id: ingredientId } });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${ingredientId} not found.`);
    }

    try {
      return await this.prisma.productIngredient.create({ data });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Product ${productId} already has ingredient ${ingredientId} associated.`);
      }
      throw error;
    }
  }

  async updateProductIngredient(
    productId: string,
    ingredientId: string,
    data: UpdateProductIngredientDto,
  ): Promise<ProductIngredient> {
    const productIngredient = await this.prisma.productIngredient.findUnique({
      where: {
        productId_ingredientId: {
          productId,
          ingredientId,
        },
      },
    });

    if (!productIngredient) {
      throw new NotFoundException(`Association between product ${productId} and ingredient ${ingredientId} not found.`);
    }

    return this.prisma.productIngredient.update({
      where: {
        productId_ingredientId: {
          productId,
          ingredientId,
        },
      },
      data,
    });
  }

  async removeProductIngredient(productId: string, ingredientId: string): Promise<ProductIngredient> {
    const productIngredient = await this.prisma.productIngredient.findUnique({
      where: {
        productId_ingredientId: {
          productId,
          ingredientId,
        },
      },
    });

    if (!productIngredient) {
      throw new NotFoundException(`Association between product ${productId} and ingredient ${ingredientId} not found.`);
    }
    return this.prisma.productIngredient.delete({
      where: {
        productId_ingredientId: {
          productId,
          ingredientId,
        },
      },
    });
  }

  // Stock operations and alerts
  async decrementStock(productId: string, quantity: number): Promise<void> {
    const productIngredients = await this.prisma.productIngredient.findMany({
      where: { productId },
      include: { ingredient: true },
    });

    for (const pi of productIngredients) {
      const newStock = pi.ingredient.stock.toNumber() - pi.quantity.toNumber() * quantity;
      await this.prisma.ingredient.update({
        where: { id: pi.ingredientId },
        data: { stock: newStock },
      });
      if (newStock < pi.ingredient.minStockAlert.toNumber()) {
        console.warn(`Stock alert for ingredient ${pi.ingredient.name}: current stock ${newStock} is below minimum ${pi.ingredient.minStockAlert}`);
        // TODO: Implement actual alerting mechanism (email, notification, etc.)
      }
    }
  }

  async checkStockAlerts(): Promise<void> {
    const lowStockIngredients = await this.prisma.ingredient.findMany({
      where: {
        stock: {
          lt: this.prisma.ingredient.fields.minStockAlert, // Compare stock with minStockAlert field
        },
      },
    });

    if (lowStockIngredients.length > 0) {
      console.warn('--- Low Stock Alerts ---');
      lowStockIngredients.forEach((ingredient) => {
        console.warn(`Ingredient: ${ingredient.name}, Current Stock: ${ingredient.stock}, Min Stock: ${ingredient.minStockAlert}`);
      });
      console.warn('------------------------');
      // TODO: Implement actual alerting mechanism
    }
  }
}
