import {CommonPaginationReqDto} from '@framework/common.dto';
import {OrderStatus, PaymentMethod} from '@prisma/client';
import {IsArray, IsOptional, IsString} from 'class-validator';

export class ListOrdersDto extends CommonPaginationReqDto {}

export class CreateOrderDto {
  paymentMethod!: PaymentMethod;

  @IsArray()
  items: {skuId: string; unitPrice: number; quantity?: number}[];

  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  status?: OrderStatus;

  @IsString()
  @IsOptional()
  note?: string;
}
