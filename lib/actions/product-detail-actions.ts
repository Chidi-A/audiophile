'use server';

import { prisma } from '@/lib/prisma';
import { ImageType, ProductImage } from '@prisma/client';
import {
  ProductDetailPageData,
  ProductDetail,
  RelatedProductCard,
  ResponsiveImage,
  GalleryImage,
  ProductWithRelations,
} from '@/types/product-detail';
import { isValidCategory } from '@/types/category';
import { notFound } from 'next/navigation';

/**
 * Fetches a product with all related data for the detail page
 * @param categorySlug - The category slug (for validation)
 * @param productSlug - The product slug
 * @returns Raw product data with all relations
 */

async function getProductWithRelations(
  categorySlug: string,
  productSlug: string
): Promise<ProductWithRelations | null> {
  // Validate category
  if (!isValidCategory(categorySlug)) {
    return null;
  }

  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    include: {
      images: true,
      boxContents: {
        orderBy: { item: 'asc' }, // Or add an order field if needed
      },
      category: true,
      relatedFrom: {
        include: {
          relatedProduct: {
            include: {
              category: true,
              images: {
                where: {
                  imageType: ImageType.CATEGORY_PREVIEW,
                },
              },
            },
          },
        },
        orderBy: { order: 'asc' },
        take: 3, // Limit to 3 related products
      },
    },
  });

  // Verify product belongs to the specified category
  if (product && product.category.slug !== categorySlug) {
    return null;
  }

  return product;
}

/**
 * Converts a ProductImage to ResponsiveImage format
 * @param image - Product image from database
 * @returns ResponsiveImage object
 */
function toResponsiveImage(image: ProductImage): ResponsiveImage {
  return {
    mobile: image.mobileUrl,
    tablet: image.tabletUrl,
    desktop: image.desktopUrl,
  };
}

/**
 * Formats raw product data into ProductDetail format
 * @param product - Raw product data with relations
 * @returns Formatted ProductDetail
 */
function formatProductDetail(product: ProductWithRelations): ProductDetail {
  // Find the main product image
  const productImage = product.images.find(
    (img) => img.imageType === ImageType.PRODUCT
  );

  // Find and sort gallery images
  const galleryImageTypes = [
    ImageType.GALLERY_1,
    ImageType.GALLERY_2,
    ImageType.GALLERY_3,
  ] as const;

  const galleryImages: GalleryImage[] = galleryImageTypes
    .map((type) => {
      const image = product.images.find((img) => img.imageType === type);
      return image
        ? {
            type: type as 'GALLERY_1' | 'GALLERY_2' | 'GALLERY_3',
            urls: toResponsiveImage(image),
          }
        : null;
    })
    .filter((img): img is GalleryImage => img !== null);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    description: product.description,
    features: product.features,
    isNew: product.isNew,
    productImage: productImage ? toResponsiveImage(productImage) : null,
    galleryImages,
    boxContents: product.boxContents.map((bc) => ({
      quantity: bc.quantity,
      item: bc.item,
    })),
  };
}

/**
 * Formats related products for display
 * @param relatedProducts - Related products from database
 * @returns Array of formatted RelatedProductCard
 */
function formatRelatedProducts(
  relatedProducts: ProductWithRelations['relatedFrom']
): RelatedProductCard[] {
  return relatedProducts.map((relation) => {
    const product = relation.relatedProduct;
    const previewImage = product.images[0]; // Should be CATEGORY_PREVIEW

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      categorySlug: product.category.slug,
      previewImage: previewImage ? toResponsiveImage(previewImage) : null,
    };
  });
}

/**
 * Gets complete product detail page data
 * @param categorySlug - The category slug
 * @param productSlug - The product slug
 * @returns Complete product detail page data or triggers notFound()
 */
export async function getProductDetailPageData(
  categorySlug: string,
  productSlug: string
): Promise<ProductDetailPageData> {
  const product = await getProductWithRelations(categorySlug, productSlug);

  if (!product) {
    notFound();
  }

  return {
    product: formatProductDetail(product),
    relatedProducts: formatRelatedProducts(product.relatedFrom),
    category: {
      name: product.category.name,
      slug: product.category.slug,
    },
  };
}
