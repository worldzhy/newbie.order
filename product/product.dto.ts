import {
  CommonListRequestDto,
  CommonListResponseDto,
} from '@framework/common.dto';
import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsOptional, IsString} from 'class-validator';

class ProductEntity {
  @ApiProperty({type: Number})
  id: number;

  @ApiProperty({type: String})
  name: string;

  @ApiProperty({type: Number})
  price: number;

  @ApiProperty({type: Number, required: false})
  discountedPrice?: number;
}

export class CreateProductRequestDto {
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

export class CreateProductResponseDto {
  @ApiProperty({type: String})
  id: string;

  @ApiProperty({type: String})
  name: string;

  @ApiProperty({type: Number})
  price: number;

  @ApiProperty({type: Number})
  discountedPrice: number;
}

export class ListProductsRequestDto extends CommonListRequestDto {
  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  name?: string;
}

export class ListProductsResponseDto extends CommonListResponseDto {
  @ApiProperty({type: ProductEntity, isArray: true})
  declare records: ProductEntity[];
}

export class UpdateProductRequestDto {
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

export class UpdateProductResponseDto extends CreateProductResponseDto {}
