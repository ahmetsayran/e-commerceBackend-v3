import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsInt()
  categoryId: number;

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  shortDescription: string;

  @IsString()
  longDescription: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stockQuantity?: number;
}
