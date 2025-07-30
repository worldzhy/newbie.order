import {
  CommonListRequestDto,
  CommonListResponseDto,
} from '@framework/common.dto';
import {ApiProperty} from '@nestjs/swagger';
import {OrderStatus, PaymentMethod} from '@prisma/client';
import {IsArray, IsIn, IsOptional, IsString} from 'class-validator';

class OrderItemEntity {
  @ApiProperty({type: String})
  id: string;

  @ApiProperty({type: String})
  spuId: string;

  @ApiProperty({type: String})
  skuId: string;

  @ApiProperty({type: Number})
  unitPrice: number;

  @ApiProperty({type: Number})
  quantity: number;

  @ApiProperty({type: Number})
  subTotal: number;
}

class OrderEntity {
  @ApiProperty({type: String})
  id: string;

  @ApiProperty({enum: OrderStatus})
  status: OrderStatus;

  @ApiProperty({type: Number})
  totalAmount: number;

  @ApiProperty({enum: PaymentMethod})
  paymentMethod: PaymentMethod;

  @ApiProperty({type: OrderItemEntity, isArray: true})
  items: OrderItemEntity[];

  @ApiProperty({type: String, required: false})
  note?: string;

  @ApiProperty({type: String})
  userId: string;
}

export class ListOrdersRequestDto extends CommonListRequestDto {
  @ApiProperty({type: String, required: false})
  @IsString()
  userId?: string;
}

export class ListOrdersResponseDto extends CommonListResponseDto {
  @ApiProperty({type: OrderEntity, isArray: true, items: {type: 'object'}})
  declare records: OrderEntity[];
}

export class CreateOrderDto {
  @ApiProperty({type: String, required: true})
  @IsString()
  wechatOpenId: string;

  @ApiProperty({type: String, required: true})
  @IsString()
  @IsIn(Object.values(PaymentMethod))
  paymentMethod: PaymentMethod;

  @ApiProperty({type: Array, required: true})
  @IsArray()
  items: {skuId: string; unitPrice: number; quantity?: number}[];

  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateOrderDto {
  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  @IsIn(Object.values(OrderStatus))
  status?: OrderStatus;

  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  note?: string;
}
