import {
  CommonListRequestDto,
  CommonListResponseDto,
} from '@framework/common.dto';
import {ApiProperty} from '@nestjs/swagger';
import {IsIn, IsNumber, IsOptional, IsString} from 'class-validator';

class SkuEntity {
  @ApiProperty({type: String})
  id: string;

  @ApiProperty({type: String})
  name: string;

  @ApiProperty({type: Number})
  price: number;

  @ApiProperty({type: Number, required: false})
  discountedPrice?: number;
}

export class CreateSkuRequestDto {
  @ApiProperty({type: String, required: true})
  @IsString()
  name: string;

  @ApiProperty({type: Number, required: true})
  @IsNumber()
  price: number;

  @ApiProperty({type: Number, required: false})
  @IsNumber()
  @IsOptional()
  discountedPrice?: number;
}

export class CreateSkuResponseDto {
  @ApiProperty({type: String})
  id: string;

  @ApiProperty({type: String})
  name: string;

  @ApiProperty({type: Number})
  price: number;

  @ApiProperty({type: Number})
  discountedPrice: number;
}

export class ListSkusRequestDto extends CommonListRequestDto {
  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  name?: string;
}

export class ListSkusResponseDto extends CommonListResponseDto {
  @ApiProperty({type: SkuEntity, isArray: true})
  declare records: SkuEntity[];
}

export class UpdateSkuRequestDto {
  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({type: Number, required: false})
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({type: Number, required: false})
  @IsNumber()
  @IsOptional()
  discountedPrice?: number;
}

export class UpdateSkuResponseDto extends CreateSkuResponseDto {}
