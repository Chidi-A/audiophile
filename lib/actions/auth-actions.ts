'use server';

import { prisma } from '@/lib/prisma';
import { signIn, signOut } from '@/lib/auth';
import { compareSync, hashSync } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import {
  signUpSchema,
  signInSchema,
  updateProfileSchema,
  changePasswordSchema,
  emailSchema,
} from '@/lib/validations/auth-schema';
import { formatError } from '../utils';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

// Sign up a new user with credentials
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;

    // Hash password
    user.password = hashSync(user.password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name: user.name || null,
        email: user.email,
        password: user.password,
      },
    });

    // Auto sign in after registration
    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: 'Signed up successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

// Sign in with credentials
export async function signInUser(prevState: unknown, formData: FormData) {
  try {
    const user = signInSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: 'Invalid email or password' };
  }
}

// Sign in with Google
export async function signInWithGoogle(prevState: unknown) {
  try {
    await signIn('google', { redirectTo: '/' });
    return { success: true, message: 'Redirecting to Google...' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  prevState: unknown,
  formData: FormData
) {
  try {
    const data = updateProfileSchema.parse({
      name: formData.get('name'),
    });

    await prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    });

    revalidatePath('/');
    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Change password
export async function changePassword(
  userId: string,
  prevState: unknown,
  formData: FormData
) {
  try {
    const data = changePasswordSchema.parse({
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return {
        success: false,
        message: 'User not found or using OAuth authentication',
      };
    }

    // Verify current password
    const isPasswordValid = compareSync(data.currentPassword, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Current password is incorrect',
      };
    }

    // Hash new password
    const hashedPassword = hashSync(data.newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Sign out
export async function signOutUser() {
  await signOut();
}

// Delete user account
export async function deleteUserAccount(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    await signOut({ redirectTo: '/' });
    return { success: true, message: 'Account deleted successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

// Check if email exists (for client-side validation)
export async function checkEmailExists(email: string) {
  try {
    const data = emailSchema.parse({ email });

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    return { exists: !!user };
  } catch (error) {
    return { exists: false, error: formatError(error) };
  }
}
