import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
