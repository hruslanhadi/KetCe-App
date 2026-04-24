import { IsString, IsOptional } from 'class-validator';

export class CreateProductGroupDto {
  @IsString()
  name: string;
}

export class UpdateProductGroupDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class ProductGroupResponseDto {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}
