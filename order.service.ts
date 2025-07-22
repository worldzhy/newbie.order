import {Injectable} from '@nestjs/common';
import {PrismaService} from '@framework/prisma/prisma.service';
import {PaymentMethod} from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: {
    paymentMethod: PaymentMethod;
    items: {skuId: string; unitPrice: number; quantity?: number}[];
    note?: string;
    userId: string;
  }) {
    let totalAmount = 0;
    for (const item of params.items) {
      totalAmount += item.unitPrice * (item.quantity || 1);
    }

    const orderItems = params.items.map(item => {
      return {
        spuId: item.skuId, // Assuming skuId is the same as spuId
        skuId: item.skuId,
        unitPrice: item.unitPrice,
        quantity: item.quantity || 1,
        subTotal: item.unitPrice * (item.quantity || 1),
      };
    });

    return await this.prisma.order.create({
      data: {
        totalAmount: totalAmount,
        paymentMethod: params.paymentMethod,
        items: {createMany: {data: orderItems}},
        note: params.note,
        userId: params.userId,
      },
    });
  }
}
