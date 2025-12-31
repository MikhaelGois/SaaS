import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductIngredientDto {
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  quantity?: number;
}
