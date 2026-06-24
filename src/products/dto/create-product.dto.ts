import { IsInt, IsNumber, IsString } from 'class-validator';

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
}
