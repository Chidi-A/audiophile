'use server';

import Stripe from 'stripe';
import { prisma } from './prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createStripePaymentIntent(
  orderId: string,
  amount: number
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: { orderId },
    });

    // Store payment intent ID in order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentResult: {
          id: paymentIntent.id,
          email_address: '',
          status: 'pending',
          pricePaid: '0',
        },
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to create payment intent',
    };
  }
}
