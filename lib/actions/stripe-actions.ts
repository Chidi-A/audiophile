'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getOrderById, updateOrderToPaid } from './order-actions';
import { SerializedOrder } from '@/types';
import { revalidatePath } from 'next/cache';

export async function completeStripePayment(
  orderId: string,
  paymentIntentId: string
): Promise<{ success: boolean; order?: SerializedOrder; message?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' };
    }

    // Get the order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
      },
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

      // Clear the cart
      const cart = await prisma.cart.findFirst({
        where: { userId: session.user.id },
      });

      if (cart) {
        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            items: [],
            itemsPrice: 0,
            totalPrice: 0,
          },
        });
      }

      revalidatePath('/checkout');
      revalidatePath('/cart');
    }

    // Get the updated order
    const orderResult = await getOrderById(orderId);
    if (!orderResult.success || !orderResult.data) {
      return { success: false, message: 'Failed to retrieve order' };
    }

    return {
      success: true,
      order: orderResult.data as SerializedOrder,
    };
  } catch (error) {
    console.error('Error completing Stripe payment:', error);
    return { success: false, message: 'Failed to process payment' };
  }
}
