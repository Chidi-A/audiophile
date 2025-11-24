import {
  signInSchema,
  signUpSchema,
  updateProfileSchema,
  changePasswordSchema,
  emailSchema,
} from '@/lib/validations/auth-schema';
import {
  cartItemSchema,
  insertCartSchema,
} from '@/lib/validations/cart-schema';
import {
  checkoutFormSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentResultSchema,
  updateOrderStatusSchema,
  shippingAddressSchema,
} from '@/lib/validations/order-schema';
import { z } from 'zod';

export type SignUpInput = z.infer<typeof signUpSchema>;

export type SignInInput = z.infer<typeof signInSchema>;

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export type EmailInput = z.infer<typeof emailSchema>;

export type CartItem = z.infer<typeof cartItemSchema>;

export type Cart = z.infer<typeof insertCartSchema>;

// Export types for TypeScript
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;
export type CheckoutForm = z.infer<typeof checkoutFormSchema>;
export type PaymentResult = z.infer<typeof paymentResultSchema>;
