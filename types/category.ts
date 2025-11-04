import { Product, ProductImage, Category } from '@prisma/client';

// Type for a product with its category preview image
export type ProductWithCategoryImage = Product & {
  images: ProductImage[];
  category: Category;
};

// Type for the category page data
export type CategoryPageData = {
  category: Category;
  products: ProductWithCategoryImage[];
};

// Type for a single product card display
export type CategoryProductCard = {
  id: number;
  slug: string;
  name: string;
  description: string;
  isNew: boolean;
  categorySlug: string;
  categoryPreviewImage: {
    mobile: string;
    tablet: string;
    desktop: string;
  } | null;
};

// Valid category slugs
export const VALID_CATEGORIES = [
  'headphones',
  'speakers',
  'earphones',
] as const;
export type ValidCategory = (typeof VALID_CATEGORIES)[number];

// Helper type guard
export function isValidCategory(category: string): category is ValidCategory {
  return VALID_CATEGORIES.includes(category as ValidCategory);
}
