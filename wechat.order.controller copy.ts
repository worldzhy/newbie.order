import {PrismaService} from '@framework/prisma/prisma.service';
import {Body, Controller, Param, Patch, Post} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {GuardByApiKey} from '@microservices/account/security/passport/api-key/api-key.decorator';
import {OrderService} from './order.service';
import {
  CreateOrderResponseDto,
  UpdateOrderRequestDto,
  UpdateOrderResponseDto,
} from './order.dto';
import {WechatCreateOrderRequestDto} from './wechat.order.dto';

@ApiTags('Order Management')
@ApiBearerAuth()
@Controller('wechat-orders')
export class WechatOrderController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService
  ) {}

  @GuardByApiKey()
  @Post('')
  @ApiResponse({type: CreateOrderResponseDto})
  @ApiOperation({summary: 'Create a new order from WeChat'})
  async createOrder(@Body() body: WechatCreateOrderRequestDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {wechatOpenId: body.wechatOpenId},
    });

    return await this.orderService.create({
      paymentMethod: body.paymentMethod,
      items: body.items,
      note: body.note,
      userId: user.id,
    });
  }

  @GuardByApiKey()
  @Patch(':id')
  @ApiResponse({type: UpdateOrderResponseDto})
  async updateOrder(
    @Param('id') id: string,
    @Body() body: UpdateOrderRequestDto
  ) {
    return await this.prisma.order.update({
      where: {id},
      data: body,
    });
  }

  /* End */
}
