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
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  CreateOrderRequestDto,
  CreateOrderResponseDto,
  ListOrdersRequestDto,
  ListOrdersResponseDto,
  UpdateOrderRequestDto,
  UpdateOrderResponseDto,
} from './order.dto';
import {OrderService} from './order.service';
import {TokenService} from '@microservices/account/security/token/token.service';
import {Request} from 'express';
import {OrderStatus} from '@prisma/client';

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
  @ApiResponse({type: CreateOrderResponseDto})
  async createOrder(
    @Req() request: Request,
    @Body() body: CreateOrderRequestDto
  ) {
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
  @ApiResponse({
    type: ListOrdersResponseDto,
  })
  @ApiOperation({
    summary: 'Get orders with pagination and sorting',
    description: 'Get orders with pagination and sorting',
  })
  async getOrders(@Query() query: ListOrdersRequestDto) {
    const result = await this.prisma.findManyInManyPages({
      model: 'Order',
      pagination: query,
      findManyArgs: {
        where: {},
        orderBy: {createdAt: 'desc'},
        include: {items: true},
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

  @Get('my')
  @ApiResponse({
    type: ListOrdersResponseDto,
  })
  @ApiOperation({
    summary: 'Get orders with pagination and sorting',
    description: 'Get orders with pagination and sorting',
  })
  async getMyOrders(
    @Req() request: Request,
    @Query() query: ListOrdersRequestDto
  ) {
    const accessToken = this.tokenService.getTokenFromHttpRequest(request);
    if (!accessToken) {
      throw new Error('Access token is required');
    }
    const userId = this.tokenService.verifyUserAccessToken(accessToken).userId;

    return await this.prisma.findManyInManyPages({
      model: 'Order',
      pagination: query,
      findManyArgs: {
        where: {userId, status: OrderStatus.PAID},
        orderBy: {createdAt: 'desc'},
        include: {items: true},
      },
    });
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return await this.prisma.order.findUnique({where: {id}});
  }

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

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return await this.prisma.order.delete({
      where: {id},
    });
  }

  /* End */
}
