import {PrismaService} from '@framework/prisma/prisma.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiBody} from '@nestjs/swagger';
import {CreateOrderDto, ListOrdersDto, UpdateOrderDto} from './order.dto';
import {OrderService} from './order.service';
import {TokenService} from '@microservices/account/security/token/token.service';
import {PaymentMethod} from '@prisma/client';
import {Request} from 'express';

@ApiTags('Order Management')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
    private readonly tokenService: TokenService
  ) {}

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

  @Get('')
  async getOrders(@Query() query: ListOrdersDto) {
    // Get orders with pagination and sorting
    const result = await this.prisma.findManyInManyPages({
      model: 'Order',
      pagination: query,
      findManyArgs: {
        where: {},
        orderBy: {createdAt: 'desc'},
      },
    });

    // Fetch user information for each order
    const users = await this.prisma.user.findMany({
      where: {
        id: {in: result.records.map(order => order.userId)},
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Attach user information to each order
    result.records.forEach(order => {
      const user = users.find(u => u.id === order.userId);
      order.userName = user ? user.name : 'Unknown User';
    });

    return result;
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return await this.prisma.order.findUnique({where: {id}});
  }

  @Patch(':id')
  async updateOrder(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    return await this.prisma.order.update({
      where: {id},
      data: body,
    });
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return await this.prisma.order.delete({
      where: {id},
    });
  }

  /* End */
}
