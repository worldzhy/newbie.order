import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {PrismaService} from '@framework/prisma/prisma.service';
import {Prisma} from '@prisma/client';
import {
  CreateSkuRequestDto,
  CreateSkuResponseDto,
  ListSkusRequestDto,
  ListSkusResponseDto,
  UpdateSkuRequestDto,
  UpdateSkuResponseDto,
} from './sku.dto';

@ApiTags('Order Management / SKU')
@ApiBearerAuth()
@Controller('skus')
export class SkuController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('')
  @ApiResponse({type: CreateSkuResponseDto})
  async createSku(@Body() body: CreateSkuRequestDto) {
    return await this.prisma.sku.create({data: body});
  }

  @Get('')
  @ApiResponse({type: ListSkusResponseDto})
  async getSkus(@Query() query: ListSkusRequestDto) {
    return await this.prisma.findManyInManyPages({
      model: Prisma.ModelName.Sku,
      pagination: query,
      findManyArgs: {orderBy: {createdAt: 'desc'}},
    });
  }

  @Get(':id')
  async getSkuById(@Param('id') id: string) {
    return await this.prisma.sku.findUnique({where: {id}});
  }

  @Patch(':id')
  @ApiResponse({type: UpdateSkuResponseDto})
  async updateSku(@Param('id') id: string, @Body() body: UpdateSkuRequestDto) {
    return await this.prisma.sku.update({
      where: {id},
      data: body,
    });
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return await this.prisma.sku.delete({
      where: {id},
    });
  }

  /* End */
}
