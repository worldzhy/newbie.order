import {Injectable} from '@nestjs/common';
import {PrismaService} from '@framework/prisma/prisma.service';
import {StripePaymentIntent} from '@prisma/client';

const stripe = require('stripe')(
  'sk_test_51N1OfRI3hIthhL2mYOBnp4mZLLUv4zL51fdiwfOIYMt0Y5URgrxMrNtT3Hh2WEL7k5XT1aB5m97MPqYTQb7129Hc009YCINgSm'
);

@Injectable()
export class StripePaymentIntentService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(params: {
    orderId: string;
    orderAmount: number;
  }): Promise<StripePaymentIntent> {
    // [step 1] Generate a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.orderAmount,
      currency: 'usd',
      // automatic_payment_methods: {enabled: true},
    });

    // [step 2] Record the payment intent in database.
    return await this.prisma.stripePaymentIntent.create({
      data: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        clientSecret: paymentIntent.client_secret,
        orderId: params.orderId,
      },
    });
  }

  async retrieve(paymentIntentId: string): Promise<StripePaymentIntent> {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return await this.prisma.stripePaymentIntent.update({
      where: {id: paymentIntentId},
      data: {
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        clientSecret: paymentIntent.client_secret,
      },
    });
  }

  /* End */
}
