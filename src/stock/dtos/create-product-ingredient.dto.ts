import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductIngredientDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  ingredientId: string;

  @IsNumber()
  @Min(0.01)
  quantity: number;
}
