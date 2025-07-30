import {CommonListRequestDto} from '@framework/common.dto';
import {ApiProperty} from '@nestjs/swagger';
import {OrderStatus, PaymentMethod} from '@prisma/client';
import {IsArray, IsIn, IsOptional, IsString} from 'class-validator';

export class ListOrdersDto extends CommonListRequestDto {}

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
