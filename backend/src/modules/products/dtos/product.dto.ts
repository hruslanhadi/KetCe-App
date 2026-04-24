import { IsString, IsNumber, IsUUID, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsUUID()
  group_id: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsUUID()
  group_id?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class ProductResponseDto {
  id: string;
  name: string;
  price: number;
  group_id: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
