import { getAllProductParams } from '@/lib/params/product-params';
import type { Metadata } from 'next';
import Container from '@/components/shared/container';
import ProductCategories from '@/components/shared/product-categories';
import AboutSection from '@/components/shared/about-section';
import ProductDetailHero from '@/components/product-detail/product-detail-hero';
import ProductFeatures from '@/components/product-detail/product-features';
import ProductGallery from '@/components/product-detail/product-gallery';
import RelatedProducts from '@/components/product-detail/related-products';
import { getCachedProductDetailPageData } from '@/lib/utils';
import BackButton from '@/components/shared/back-button';

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateStaticParams() {
  return await getAllProductParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug, slug: productSlug } = await params;
  const { product, category } = await getCachedProductDetailPageData(
    categorySlug,
    productSlug
  );

  return {
    title: `${product.name} | ${category.name}`,
    description: product.description,
  };
}

const ProductDetailPage = async ({ params }: Props) => {
  const { category: categorySlug, slug: productSlug } = await params;
  const data = await getCachedProductDetailPageData(categorySlug, productSlug);

  return (
    <>
      {/* Product Hero Section */}
      <section>
        <Container className="pt-8 md:pt-16">
          {/* Go Back Link */}
          <BackButton
            fallbackUrl={`/${categorySlug}`}
            className="inline-block text-[15px] text-black/50 hover:text-black transition-colors "
          />
        </Container>
      </section>
      {/* Product Main Info */}
      <section>
        <Container className="py-6 md:py-8 lg:py-14">
          <ProductDetailHero product={data.product} />
        </Container>
      </section>
      ;{/* Features & Box Contents */}
      <section>
        <Container className="py-16 md:py-20 lg:py-24">
          <ProductFeatures
            features={data.product.features}
            boxContents={data.product.boxContents}
          />
        </Container>
      </section>
      ;{/* Gallery */}
      {data.product.galleryImages.length > 0 && (
        <section>
          <Container className="py-8 md:py-12 lg:py-16">
            <ProductGallery images={data.product.galleryImages} />
          </Container>
        </section>
      )}
      {/* Related Products */}
      {data.relatedProducts.length > 0 && (
        <section>
          <Container className="py-16 md:py-20 lg:py-32">
            <RelatedProducts products={data.relatedProducts} />
          </Container>
        </section>
      )}
      {/* Product Categories Navigation */}
      <ProductCategories noPaddingTop />
      {/* About Section */}
      <AboutSection />
    </>
  );
};

export default ProductDetailPage;
