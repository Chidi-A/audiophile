'use server';

import { prisma } from '@/lib/prisma';
import { isValidCategory } from '@/types/category';

/**
 * Gets all product slugs for a specific category
 * Used for generateStaticParams in [slug] routes
 * @param categorySlug - The category slug
 * @returns Array of product slugs
 */
export async function getProductSlugsForCategory(
  categorySlug: string
): Promise<string[]> {
  if (!isValidCategory(categorySlug)) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: categorySlug,
      },
    },
    select: {
      slug: true,
    },
  });

  return products.map((p) => p.slug);
}

/**
 * Gets all category/product slug combinations for static generation
 * Used for generateStaticParams in [category]/[slug] routes
 * @returns Array of { category, slug } objects
 */
export async function getAllProductParams(): Promise<
  Array<{ category: string; slug: string }>
> {
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      category: {
        select: {
          slug: true,
        },
      },
    },
  });

  return products.map((p) => ({
    category: p.category.slug,
    slug: p.slug,
  }));
}

/**
 * Gets all product slugs across all categories
 * Useful for sitemap generation or search indexing
 * @returns Array of all product slugs
 */
export async function getAllProductSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({
    select: {
      slug: true,
    },
  });

  return products.map((p) => p.slug);
}
