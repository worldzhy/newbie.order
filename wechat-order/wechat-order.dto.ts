import {ApiProperty} from '@nestjs/swagger';
import {IsArray, IsIn, IsOptional, IsString} from 'class-validator';
import {OrderItemRequestEntity} from '../order.entity';
import {OrderStatus} from '@prisma/client';

export class CreateWechatOrderRequestDto {
  @ApiProperty({type: String, required: true})
  @IsString()
  wechatOpenId: string;

  @ApiProperty({type: OrderItemRequestEntity, isArray: true, required: true})
  @IsArray()
  items: OrderItemRequestEntity[];

  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateWechatOrderRequestDto {
  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  @IsIn(Object.values(OrderStatus))
  status?: OrderStatus;

  @ApiProperty({type: String, required: false})
  @IsOptional()
  @IsString()
  wechatTransactionId?: string;
}
