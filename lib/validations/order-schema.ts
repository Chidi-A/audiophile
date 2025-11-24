import { z } from 'zod';

// Schema for shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Street address is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
});

// Payment result schema - for storing payment gateway responses
export const paymentResultSchema = z
  .object({
    id: z.string().optional(),
    status: z.string().optional(),
    email_address: z.string().email().optional(),
    pricePaid: z.string().optional(),
    timestamp: z.string().optional(),
  })
  .passthrough();
// Insert order schema
export const insertOrderSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z
    .string()
    .min(1, 'Payment method is required')
    .max(50, 'Payment method name is too long'),

  itemsPrice: z
    .number()
    .nonnegative('Items price cannot be negative')
    .refine(
      (val) => Number.isFinite(val),
      'Items price must be a valid number'
    ),
  shippingPrice: z
    .number()
    .nonnegative('Shipping price cannot be negative')
    .refine(
      (val) => Number.isFinite(val),
      'Shipping price must be a valid number'
    ),
  taxPrice: z
    .number()
    .nonnegative('Tax price cannot be negative')
    .refine((val) => Number.isFinite(val), 'Tax price must be a valid number'),
  totalPrice: z
    .number()
    .positive('Total price must be positive')
    .refine(
      (val) => Number.isFinite(val),
      'Total price must be a valid number'
    ),
});

// Schema for inserting order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  qty: z.number(),
  price: z.number().positive('Price must be positive'),
  name: z.string(),
  slug: z.string(),
  image: z.string(),
});

// Update order status schema
export const updateOrderStatusSchema = z.object({
  isPaid: z.boolean().optional(),
  paidAt: z.date().optional().nullable(),
  isDelivered: z.boolean().optional(),
  deliveredAt: z.date().optional().nullable(),
  paymentResult: paymentResultSchema.optional().nullable(),
});

// Checkout form schema - for the frontend form validation
export const checkoutFormSchema = z
  .object({
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.enum(['e-Money', 'Cash on Delivery']),
    // Optional: save address for future use
    saveAddress: z.boolean().default(false),
    // e-Money fields
    eMoneyNumber: z.string().optional(),
    eMoneyPin: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === 'e-Money') {
      if (!data.eMoneyNumber || data.eMoneyNumber.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'e-Money Number is required',
          path: ['eMoneyNumber'],
        });
      }
      if (!data.eMoneyPin || data.eMoneyPin.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'e-Money PIN is required',
          path: ['eMoneyPin'],
        });
      }
    }
  });
