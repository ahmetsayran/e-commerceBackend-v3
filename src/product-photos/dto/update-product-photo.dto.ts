import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class UpdateProductPhotoDto {
  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
