import { IsString, IsNumber, IsUUID, IsOptional, IsEnum, Min } from 'class-validator';
import { OrderSource } from '@/common/database/entities/order.entity';

export class CreateOrderItemDto {
  @IsUUID()
  product_id: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  packing?: string;

  @IsOptional()
  @IsString()
  information?: string;
}

export class CreateOrderDto {
  @IsString()
  customer_name: string;

  @IsString()
  customer_phone: string;

  @IsOptional()
  @IsString()
  delivery_address?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  items: CreateOrderItemDto[];

  @IsEnum(OrderSource)
  source: OrderSource;
}

export class UpdateOrderStatusDto {
  @IsString()
  status: string;
}

export class OrderResponseDto {
  id: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  delivery_status: string;
  source: string;
  total_price: number;
  notes: string;
  delivery_address: string;
  created_at: Date;
  updated_at: Date;
  items: any[];
}
