import { z } from 'zod';

export const cartItemSchema = z.object({
  productId: z.number().int().positive('Product ID must be a positive integer'),
  slug: z.string().min(1, 'Slug is required'),
  name: z.string().min(1, 'Product name is required'),
  price: z.number().int().positive('Price must be a positive integer'),
  quantity: z
    .number()
    .int()
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Quantity cannot exceed 99'),
  image: z.string().nullable(),
});

export const insertCartSchema = z.object({
  userId: z.string().cuid('Invalid user ID').optional().nullable(),
  sessionCartId: z.string().min(1, 'Session cart ID is required'),
  items: z.array(cartItemSchema).default([]),
  itemsPrice: z
    .number()
    .int()
    .min(0, 'Items price cannot be negative')
    .default(0),
  totalPrice: z
    .number()
    .int()
    .min(0, 'Total price cannot be negative')
    .default(0),
});
