import { Expose, Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterProductsDto {
  @IsOptional()
  @Expose({ name: 'category_id' })
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @Expose({ name: 'min_price' })
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Expose({ name: 'max_price' })
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Expose({ name: 'min_rating' })
  @Type(() => Number)
  @IsNumber()
  minRating?: number;

  @IsOptional()
  @IsString()
  sort?: string;
}
