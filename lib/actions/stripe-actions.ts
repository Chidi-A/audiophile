'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateOrderToPaid, getOrderById } from './order-actions';
import { PaymentResult } from '@/types';

export async function completeStripePayment(paymentIntentId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' };
    }

    // Find order by payment intent
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        paymentMethod: 'Stripe',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const order = orders.find((order) => {
      const paymentResult = order.paymentResult as PaymentResult | null;
      return paymentResult?.id === paymentIntentId;
    });

    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    // Mark as paid if not already
    if (!order.isPaid) {
      await updateOrderToPaid({
        orderId: order.id,
        paymentResult: {
          id: paymentIntentId,
          status: 'COMPLETED',
          email_address: session.user.email || '',
          pricePaid: order.totalPrice.toString(),
        },
      });
    }

    // Get the completed order
    const orderResult = await getOrderById(order.id);

    return {
      success: true,
      order: orderResult.data,
    };
  } catch (error) {
    console.error('Error completing Stripe payment:', error);
    return {
      success: false,
      message: 'Failed to complete payment',
    };
  }
}
