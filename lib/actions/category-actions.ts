'use server';

import { prisma } from '@/lib/prisma';
import { ImageType } from '@/lib/generated/prisma/enums';
import {
  CategoryPageData,
  CategoryProductCard,
  isValidCategory,
} from '@/types/category';
import { notFound } from 'next/navigation';

/**
 * Fetches all products for a given category with their category preview images
 * @param categorySlug - The slug of the category (e.g., 'headphones', 'speakers', 'earphones')
 * @returns CategoryPageData with category info and products
 */

export async function getCategoryProducts(
  categorySlug: string
): Promise<CategoryPageData> {
  // Validate category
  if (!isValidCategory(categorySlug)) {
    notFound();
  }

  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    notFound();
  }

  // Fetch products with their category preview images
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: categorySlug,
      },
    },
    include: {
      images: {
        where: {
          imageType: ImageType.CATEGORY_PREVIEW,
        },
      },
      category: true,
    },
    orderBy: [
      { isNew: 'desc' }, // New products first
      { createdAt: 'desc' }, // Then by newest
    ],
  });

  return {
    category,
    products,
  };
}

/**
 * Transforms raw product data into a format optimized for category page cards
 * @param products - Array of products with images from the database
 * @returns Array of formatted product cards
 */

function formatCategoryProducts(
  products: CategoryPageData['products']
): CategoryProductCard[] {
  return products.map((product) => {
    // Find the category preview image
    const categoryImage = product.images.find(
      (img) => img.imageType === ImageType.CATEGORY_PREVIEW
    );

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      isNew: product.isNew,
      categorySlug: product.category.slug,
      categoryPreviewImage: categoryImage
        ? {
            mobile: categoryImage.mobileUrl,
            tablet: categoryImage.tabletUrl,
            desktop: categoryImage.desktopUrl,
          }
        : null,
    };
  });
}

/**
 * Gets formatted products for category page - combines fetch and format
 * @param categorySlug - The slug of the category
 * @returns Object with category and formatted products
 */
export async function getCategoryPageData(categorySlug: string) {
  const data = await getCategoryProducts(categorySlug);
  const formattedProducts = formatCategoryProducts(data.products);

  return {
    category: data.category,
    products: formattedProducts,
  };
}

/**
 * Gets all available categories for navigation/validation
 * @returns Array of all categories
 */
export async function getAllCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

/**
 * Validates if a category exists
 * @param categorySlug - The slug to validate
 * @returns boolean indicating if category exists
 */
export async function categoryExists(categorySlug: string): Promise<boolean> {
  if (!isValidCategory(categorySlug)) {
    return false;
  }

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  return !!category;
}
