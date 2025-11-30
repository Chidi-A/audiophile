'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  formatError,
  calculateOrderPrices,
  convertCentsToDecimal,
} from '@/lib/utils';
import { getMyCart } from './cart-actions';
import {
  insertOrderSchema,
  checkoutFormSchema,
} from '@/lib/validations/order-schema';
import { CartItem, PaymentResult, ShippingAddress } from '@/types';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { revalidatePath } from 'next/cache';
import { paypal } from '../paypal';

export async function createOrder(data: {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  saveAddress?: boolean;
  eMoneyNumber?: string;
  eMoneyPin?: string;
}) {
  try {
    // Validate checkout form data
    const validatedData = checkoutFormSchema.parse(data);

    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Please sign in to place an order',
        redirectTo: '/sign-in',
      };
    }

    const userId = session.user.id as string;

    // Get user's cart
    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty',
        redirectTo: '/cart',
      };
    }

    // Calculate prices with shipping and tax
    const prices = calculateOrderPrices(Number(cart.itemsPrice));

    // Create order object and validate
    const order = insertOrderSchema.parse({
      userId: userId,
      shippingAddress: validatedData.shippingAddress,
      paymentMethod: validatedData.paymentMethod,
      itemsPrice: prices.itemsPrice,
      shippingPrice: prices.shippingPrice,
      taxPrice: prices.taxPrice,
      totalPrice: prices.totalPrice,
      isPaid: false,
      isDelivered: false,
    });

    // Use Prisma transaction to: create order, create order items, clear cart, and optionally save user address
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const insertedOrder = await tx.order.create({
        data: order,
      });

      // 2. Create order items from cart items
      for (const cartItem of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            orderId: insertedOrder.id,
            productId: cartItem.productId, // Already a number from CartItem
            qty: cartItem.quantity,
            price: convertCentsToDecimal(cartItem.price),
            name: cartItem.name,
            slug: cartItem.slug,
            image: cartItem.image || '/images/placeholder.png',
          },
        });
      }

      // 3. Clear the cart (only for non-PayPal payments)
      // For PayPal, cart will be cleared after successful payment
      if (
        order.paymentMethod !== 'PayPal' &&
        order.paymentMethod !== 'Stripe'
      ) {
        await tx.cart.update({
          where: { id: cart.id },
          data: {
            items: [],
            itemsPrice: 0,
            totalPrice: 0,
          },
        });
      }

      // 4. Optionally save address and payment method to user profile
      if (validatedData.saveAddress) {
        await tx.user.update({
          where: { id: userId },
          data: {
            address: validatedData.shippingAddress,
            paymentMethod: validatedData.paymentMethod,
          },
        });
      }

      return insertedOrder.id;
    });

    if (!insertedOrderId) {
      throw new Error('Failed to create order');
    }

    // Revalidate relevant paths
    revalidatePath('/');
    revalidatePath('/cart');

    if (order.paymentMethod !== 'PayPal') {
      revalidatePath('/checkout');
    }

    return {
      success: true,
      message: 'Order created successfully',
      redirectTo: `/order/${insertedOrderId}`,
      data: insertedOrderId,
    };
  } catch (error) {
    // Handle Next.js redirect errors
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get Order by ID
export async function getOrderById(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    // Convert Decimal fields to numbers for client compatibility
    const serializedOrder = {
      ...order,
      itemsPrice: Number(order.itemsPrice),
      shippingPrice: Number(order.shippingPrice),
      taxPrice: Number(order.taxPrice),
      totalPrice: Number(order.totalPrice),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    };

    return {
      success: true,
      data: serializedOrder,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Create a Paypal Order
export async function createPayPalOrder(orderId: string) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
      // Create a paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      // Update the order with the paypal order id
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: '',
            status: '',
            pricePaid: '0',
          },
        },
      });

      // Return the paypal order id
      return {
        success: true,
        message: 'PayPal order created successfully',
        data: paypalOrder.id,
      };
    } else {
      throw new Error('Order not found');
    }
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

// Approve Paypal Order
export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    // Find the order in the database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    if (!order) throw new Error('Order not found');

    // Check if the order is already paid
    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== 'COMPLETED'
    )
      throw new Error('Error in paypal payment');

    // Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    // Clear the cart after successful PayPal payment
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

    revalidatePath(`/order/${orderId}`);
    revalidatePath('/cart');
    revalidatePath('/checkout');

    return {
      success: true,
      message: 'Your order has been successfully paid by PayPal',
    };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

// Update Order to Paid in Database
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  // Find the order in the database and include the order items
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
    },
  });

  if (!order) throw new Error('Order not found');

  if (order.isPaid) throw new Error('Order is already paid');

  // Transaction to update the order and update the product quantities
  await prisma.$transaction(async (tx) => {
    // Set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  // Get the updated order after the transaction
  const updatedOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) {
    throw new Error('Order not found');
  }
}
