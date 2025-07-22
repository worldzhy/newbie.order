import {PrismaService} from '@framework/prisma/prisma.service';
import {Body, Controller, Param, Patch, Post, Req} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiBody} from '@nestjs/swagger';
import {CreateOrderDto, UpdateOrderDto} from './order.dto';
import {OrderService} from './order.service';
import {TokenService} from '@microservices/account/security/token/token.service';
import {PaymentMethod} from '@prisma/client';
import {Request} from 'express';
import {GuardByApiKey} from '@microservices/account/security/passport/api-key/api-key.decorator';

@ApiTags('Order Management')
@ApiBearerAuth()
@Controller('wechat-orders')
export class WechatOrderController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
    private readonly tokenService: TokenService
  ) {}

  @GuardByApiKey()
  @Post('')
  @ApiBody({
    description: 'Create a folder in AWS S3',
    examples: {
      a: {
        value: {
          paymentMethod: PaymentMethod.WECHAT_PAY,
          items: [
            {
              skuId: '44f36b0b-2602-45d0-a2ed-b22085d1e845',
              unitPrice: 100.0,
              quantity: 1,
            },
          ],
          note: 'This is a test order',
        },
      },
    },
  })
  async createOrder(@Req() request: Request, @Body() body: CreateOrderDto) {
    const accessToken = this.tokenService.getTokenFromHttpRequest(request);
    if (!accessToken) {
      throw new Error('Access token is required');
    }
    const userId = this.tokenService.verifyUserAccessToken(accessToken).userId;

    return await this.orderService.create({
      paymentMethod: body.paymentMethod,
      items: body.items,
      note: body.note,
      userId,
    });
  }

  @GuardByApiKey()
  @Patch(':id')
  async updateOrder(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    return await this.prisma.order.update({
      where: {id},
      data: body,
    });
  }

  /* End */
}
