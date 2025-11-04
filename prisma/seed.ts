import { PrismaClient, ImageType } from '@prisma/client';
import data from '../db/data.json';

const prisma = new PrismaClient();

async function main() {
  // First, create categories
  const categories = Array.from(new Set(data.map((p) => p.category)));

  for (const categoryName of categories) {
    await prisma.category.upsert({
      where: { slug: categoryName },
      update: {},
      create: {
        name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
        slug: categoryName,
      },
    });
  }

  // Create products with images and box contents
  for (const product of data) {
    const category = await prisma.category.findUnique({
      where: { slug: product.category },
    });

    if (!category) continue;

    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        slug: product.slug,
        name: product.name,
        categoryId: category.id,
        isNew: product.new,
        price: product.price * 100, // Convert to cents
        description: product.description,
        features: product.features,
      },
    });

    // Create product images
    await prisma.productImage.createMany({
      data: [
        {
          productId: createdProduct.id,
          imageType: ImageType.PRODUCT,
          mobileUrl: product.image.mobile,
          tabletUrl: product.image.tablet,
          desktopUrl: product.image.desktop,
        },
        {
          productId: createdProduct.id,
          imageType: ImageType.CATEGORY_PREVIEW,
          mobileUrl: product.categoryImage.mobile,
          tabletUrl: product.categoryImage.tablet,
          desktopUrl: product.categoryImage.desktop,
        },
        {
          productId: createdProduct.id,
          imageType: ImageType.GALLERY_1,
          mobileUrl: product.gallery.first.mobile,
          tabletUrl: product.gallery.first.tablet,
          desktopUrl: product.gallery.first.desktop,
        },
        {
          productId: createdProduct.id,
          imageType: ImageType.GALLERY_2,
          mobileUrl: product.gallery.second.mobile,
          tabletUrl: product.gallery.second.tablet,
          desktopUrl: product.gallery.second.desktop,
        },
        {
          productId: createdProduct.id,
          imageType: ImageType.GALLERY_3,
          mobileUrl: product.gallery.third.mobile,
          tabletUrl: product.gallery.third.tablet,
          desktopUrl: product.gallery.third.desktop,
        },
      ],
      skipDuplicates: true,
    });

    // Create box contents
    await prisma.boxContent.createMany({
      data: product.includes.map((item) => ({
        productId: createdProduct.id,
        quantity: item.quantity,
        item: item.item,
      })),
      skipDuplicates: true,
    });
  }
  console.log('✅ Products, images, and box contents created');

  // Create related products
  for (const product of data) {
    const mainProduct = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (!mainProduct) continue;

    for (const related of product.others) {
      const relatedProduct = await prisma.product.findUnique({
        where: { slug: related.slug },
      });

      if (!relatedProduct) continue;

      await prisma.relatedProduct.upsert({
        where: {
          productId_relatedProductId: {
            productId: mainProduct.id,
            relatedProductId: relatedProduct.id,
          },
        },
        update: {},
        create: {
          productId: mainProduct.id,
          relatedProductId: relatedProduct.id,
        },
      });
    }
  }
  console.log('✅ Related products created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
