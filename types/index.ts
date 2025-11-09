import {
  signInSchema,
  signUpSchema,
  updateProfileSchema,
  changePasswordSchema,
  emailSchema,
} from '@/lib/validations/auth-schema';
import { z } from 'zod';

export type SignUpInput = z.infer<typeof signUpSchema>;

export type SignInInput = z.infer<typeof signInSchema>;

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export type EmailInput = z.infer<typeof emailSchema>;
