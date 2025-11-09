'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateProfileSchema } from '@/lib/validations/auth-schema';
import { formatError } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function updateProfile(
  values: z.infer<typeof updateProfileSchema>
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    const validatedData = updateProfileSchema.parse(values);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: validatedData.name },
    });

    revalidatePath('/user/profile');
    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
