import {ApiProperty} from '@nestjs/swagger';
import {PaymentMethod} from '@prisma/client';
import {IsArray, IsIn, IsOptional, IsString} from 'class-validator';
import {OrderItemRequestEntity} from './order.entity';

export class WechatCreateOrderRequestDto {
  @ApiProperty({type: String, required: true})
  @IsString()
  wechatOpenId: string;

  @ApiProperty({type: String, required: true})
  @IsString()
  @IsIn(Object.values(PaymentMethod))
  paymentMethod: PaymentMethod;

  @ApiProperty({type: OrderItemRequestEntity, isArray: true, required: true})
  @IsArray()
  items: OrderItemRequestEntity[];

  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  note?: string;
}
