import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FilterCommentsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  productId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  rating?: number;
}
