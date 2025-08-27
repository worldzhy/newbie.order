import {PrismaService} from '@framework/prisma/prisma.service';
import {Body, Controller, Param, Patch, Post} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {GuardByApiKey} from '@microservices/account/security/passport/api-key/api-key.decorator';
import {OrderService} from '../order.service';
import {
  CreateOrderResponseDto,
  UpdateOrderRequestDto,
  UpdateOrderResponseDto,
} from '../order.dto';
import {WechatCreateOrderRequestDto} from './wechat-order.dto';
import {PaymentMethod} from '@prisma/client';

@ApiTags('Order Management / Wechat Order')
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
  @ApiOperation({
    summary: '[Auth by API key] Call from Tencent cloudbase workflow',
  })
  async createOrder(@Body() body: WechatCreateOrderRequestDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {wechatOpenId: body.wechatOpenId},
    });

    // [step 2] Check if there's an existing pending order
    const existingOrders = await this.prisma.order.findMany({
      where: {userId: user.id, status: 'PENDING'},
      include: {items: true},
    });

    // Compare items of existing orders with the new order
    for (const order of existingOrders) {
      const existingItems = order.items;

      if (
        existingItems.length === body.items.length &&
        existingItems.every((existingItem, index) => {
          const newItem = body.items[index];
          return (
            existingItem.skuId === newItem.skuId &&
            existingItem.quantity === newItem.quantity
          );
        })
      ) {
        // If items match, return the existing order
        return order;
      }
    }

    return await this.orderService.create({
      paymentMethod: PaymentMethod.WECHAT_PAY,
      items: body.items,
      note: body.note,
      userId: user.id,
    });
  }

  @GuardByApiKey()
  @Patch(':id')
  @ApiResponse({type: UpdateOrderResponseDto})
  @ApiOperation({
    summary: '[Auth by API key] Call from Tencent cloudbase workflow',
  })
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
