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
  priceInCents: number;

  @ApiProperty({type: Number, required: false})
  priceInCentsDiscounted?: number;
}

export class CreateProductRequestDto {
  @ApiProperty({type: String, required: true})
  @IsString()
  name: string;

  @ApiProperty({type: Number, required: true})
  @IsNumber()
  priceInCents: number;

  @ApiProperty({type: Number, required: false})
  @IsNumber()
  @IsOptional()
  priceInCentsDiscounted?: number;
}

export class CreateProductResponseDto {
  @ApiProperty({type: String})
  id: string;

  @ApiProperty({type: String})
  name: string;

  @ApiProperty({type: Number})
  priceInCents: number;

  @ApiProperty({type: Number})
  priceInCentsDiscounted: number;
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
  priceInCents?: number;

  @ApiProperty({type: Number, required: false})
  @IsNumber()
  @IsOptional()
  priceInCentsDiscounted?: number;
}

export class UpdateProductResponseDto extends CreateProductResponseDto {}
