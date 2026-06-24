import { IsInt, IsString } from 'class-validator';

export class CreateProductPhotoDto {
  @IsInt()
  productId: number;

  @IsString()
  url: string;

  @IsInt()
  size: number;
}
