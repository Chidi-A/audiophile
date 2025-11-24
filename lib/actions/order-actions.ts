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
import { CartItem, ShippingAddress } from '@/types';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { revalidatePath } from 'next/cache';

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

      // 3. Clear the cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          totalPrice: 0,
        },
      });

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
    revalidatePath('/checkout');

    return {
      success: true,
      message: 'Order created successfully',
      redirectTo: `/order/${insertedOrderId}`,
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
