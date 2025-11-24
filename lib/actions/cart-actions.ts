'use server';

import { CartItem } from '@/types';
import { cookies } from 'next/headers';
import { formatError } from '@/lib/utils';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  cartItemSchema,
  insertCartSchema,
} from '@/lib/validations/cart-schema';

import { convertToPlainObject } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

/**
 * Calculate cart prices from items
 */
function calculatePrices(items: CartItem[]) {
  const itemsPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalPrice = itemsPrice;
  return { itemsPrice, totalPrice };
}

export async function getMyCart() {
  //Check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // get cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice,
    totalPrice: cart.totalPrice,
  });
}

export async function addItemToCart(data: CartItem) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();

    // Parse and validate cart item
    const item = cartItemSchema.parse(data);

    if (!cart) {
      // Cart doesn't exist - create new cart
      const newCart = insertCartSchema.parse({
        userId: userId,
        sessionCartId: sessionCartId,
        items: [item],
        ...calculatePrices([item]),
      });

      // Save cart to database
      await prisma.cart.create({
        data: newCart,
      });

      // Revalidate pages
      revalidatePath('/');
      revalidatePath(`/${item.slug}`);

      return {
        success: true,
        message: `${item.name} added to cart`,
      };
    } else {
      // Cart exists - update it
      const items = cart.items as CartItem[];

      // Check if item already exists in cart
      const existingItem = items.find((x) => x.productId === item.productId);

      if (existingItem) {
        // Item exists - increase quantity (max 99)
        const newQuantity = Math.min(existingItem.quantity + item.quantity, 99);

        // Update the item quantity
        const updatedItems = items.map((x) =>
          x.productId === item.productId ? { ...x, quantity: newQuantity } : x
        );

        // Update cart in database
        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            items: updatedItems,
            ...calculatePrices(updatedItems),
          },
        });

        // Revalidate pages
        revalidatePath('/');
        revalidatePath(`/${item.slug}`);

        return {
          success: true,
          message: `${item.name} updated in cart`,
        };
      } else {
        // Item doesn't exist - add to cart
        const updatedItems = [...items, item];

        // Update cart in database
        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            items: updatedItems,
            ...calculatePrices(updatedItems),
          },
        });

        // Revalidate pages
        revalidatePath('/');
        revalidatePath(`/${item.slug}`);

        return {
          success: true,
          message: `${item.name} added to cart`,
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Handles both increment/decrement and removal at quantity 0
export async function updateCartItemQuantity(
  productId: number,
  quantity: number
) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    const items = cart.items as CartItem[];

    // If quantity is 0, remove the item
    if (quantity <= 0) {
      const updatedItems = items.filter((item) => item.productId !== productId);

      if (updatedItems.length === 0) {
        await prisma.cart.delete({ where: { id: cart.id } });
      } else {
        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            items: updatedItems,
            ...calculatePrices(updatedItems),
          },
        });
      }

      revalidatePath('/');
      return { success: true, message: 'Item removed from cart' };
    }

    // Update quantity (capped at 99)
    const updatedItems = items.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.min(quantity, 99) }
        : item
    );

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: updatedItems,
        ...calculatePrices(updatedItems),
      },
    });

    revalidatePath('/');
    return { success: true, message: 'Cart updated' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Clear entire cart - used for "Remove all" button
export async function clearCart() {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    const cart = await getMyCart();
    if (!cart) {
      return { success: true, message: 'Cart is already empty' };
    }

    // Delete the cart from database
    await prisma.cart.delete({ where: { id: cart.id } });

    revalidatePath('/');
    return { success: true, message: 'Cart cleared' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get total number of items in cart (sum of all quantities)
export async function getCartItemCount() {
  try {
    const cart = await getMyCart();
    if (!cart) return 0;

    const items = cart.items as CartItem[];
    // Sum up all quantities (e.g., 2 headphones + 3 speakers = 5 total items)
    return items.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    return 0;
  }
}
