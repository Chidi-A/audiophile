import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getOrderById } from '@/lib/actions/order-actions';
import { updateOrderToPaid } from '@/lib/actions/order-actions';
import { prisma } from '@/lib/prisma';
import { PaymentSuccessModal } from '@/components/payment-success-modal';
import { PaymentResult, SerializedOrder } from '@/types';

export default async function StripePaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  // Await searchParams in Next.js 15
  const params = await searchParams;
  const paymentIntentId = params.payment_intent;

  if (!paymentIntentId) {
    redirect('/');
  }

  // Find all orders for this user and filter in memory
  // This is more reliable than JSON path queries which vary by database
  const userOrders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      paymentMethod: 'Stripe',
    },
    include: {
      orderItems: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Find the order with matching payment intent
  const order = userOrders.find((order) => {
    const paymentResult = order.paymentResult as PaymentResult | null;
    return paymentResult?.id === paymentIntentId;
  });

  if (!order) {
    console.error('Order not found for payment intent:', paymentIntentId);
    redirect('/');
  }

  // Mark order as paid if not already
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
      where: { userId: order.userId },
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
  }

  // Get the updated order
  const orderResult = await getOrderById(order.id);

  if (!orderResult.success || !orderResult.data) {
    console.error('Failed to get order:', orderResult.message);
    redirect('/');
  }

  const serializedOrder = orderResult.data as SerializedOrder;

  // JSX return is outside any try/catch block
  return <PaymentSuccessModal open={true} order={serializedOrder} />;
}
