import {ApiProperty} from '@nestjs/swagger';
import {IsArray, IsIn, IsOptional, IsString} from 'class-validator';
import {OrderItemRequestEntity} from '../order.entity';

export class WechatCreateOrderRequestDto {
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
