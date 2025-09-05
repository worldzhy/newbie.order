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
import {CreateOrderResponseDto, UpdateOrderResponseDto} from '../order.dto';
import {
  WechatWorkflowCreateOrderRequestDto,
  WechatWorkflowUpdateOrderPaidRequestDto,
} from './wechat-workflow.dto';
import {OrderStatus, PaymentMethod} from '@prisma/client';

@ApiTags('Order Management / Wechat Workflow Order')
@ApiBearerAuth()
@GuardByApiKey()
@Controller('wechat-workflow-orders')
export class WechatWorkflowOrderController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService
  ) {}

  @Post('')
  @ApiOperation({
    summary: '[Auth by API key] Call from Tencent cloudbase workflow',
  })
  @ApiResponse({type: CreateOrderResponseDto})
  async createOrder(@Body() body: WechatWorkflowCreateOrderRequestDto) {
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

  @Patch(':id/paid')
  @ApiResponse({type: UpdateOrderResponseDto})
  async paid(
    @Param('id') id: string,
    @Body() body: WechatWorkflowUpdateOrderPaidRequestDto
  ) {
    return await this.prisma.order.update({
      where: {id},
      data: {
        status: OrderStatus.PAID,
        wechatTransactionId: body.wechatTransactionId,
      },
    });
  }

  @Patch(':id/refunded')
  @ApiResponse({type: UpdateOrderResponseDto})
  async refunded(@Param('id') id: string) {
    return await this.prisma.order.update({
      where: {id},
      data: {status: OrderStatus.REFUNDED},
    });
  }

  /* End */
}
