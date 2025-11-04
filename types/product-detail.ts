import {
  Product,
  ProductImage,
  BoxContent,
  Category,
} from '@/lib/generated/prisma/client';

// Responsive image URLs
export type ResponsiveImage = {
  mobile: string;
  tablet: string;
  desktop: string;
};

// Gallery image with its type
export type GalleryImage = {
  type: 'GALLERY_1' | 'GALLERY_2' | 'GALLERY_3';
  urls: ResponsiveImage;
};

// Box content item for display
export type BoxContentItem = {
  quantity: number;
  item: string;
};

// Related product card for "You May Also Like" section
export type RelatedProductCard = {
  id: number;
  slug: string;
  name: string;
  categorySlug: string;
  previewImage: ResponsiveImage | null;
};

// Main product detail data
export type ProductDetail = {
  id: number;
  slug: string;
  name: string;
  price: number; // in cents
  description: string;
  features: string;
  isNew: boolean;
  productImage: ResponsiveImage | null;
  galleryImages: GalleryImage[];
  boxContents: BoxContentItem[];
};

// Complete product detail page data
export type ProductDetailPageData = {
  product: ProductDetail;
  relatedProducts: RelatedProductCard[];
  category: {
    name: string;
    slug: string;
  };
};

// Raw product data from database (for internal use)
export type ProductWithRelations = Product & {
  images: ProductImage[];
  boxContents: BoxContent[];
  category: Category;
  relatedFrom: Array<{
    relatedProduct: Product & {
      category: Category;
      images: ProductImage[];
    };
    order: number;
  }>;
};
