import { getCategoryPageData } from '@/lib/actions/category-actions';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Container from '@/components/shared/container';
import CategoryProductCard from '@/components/category/category-product-card';
import AboutSection from '@/components/shared/about-section';
import ProductCategories from '@/components/shared/product-categories';

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const { category } = await getCategoryPageData(categorySlug);

  return {
    title: `${category.name}`,
    description: `Browse our selection of premium ${category.name.toLowerCase()}`,
  };
}

const CategoryPage = async ({ params }: Props) => {
  const { category: categorySlug } = await params;

  // Fetch data
  const { category, products } = await getCategoryPageData(categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <>
      {/* Category Header */}
      <section className="bg-black">
        <Container className="lg:py-24 lg:pt-40 pt-34 md:pt-48 pb-8">
          <h1 className="text-white text-[28px] md:text-[40px] font-bold uppercase text-center tracking-[1.5px] md:tracking-[2px]">
            {category.name}
          </h1>
        </Container>
      </section>

      {/* Products List */}
      <section>
        <Container className="py-16 md:py-24 lg:py-40">
          <div className="space-y-[120px] md:space-y-[150px] lg:space-y-[160px]">
            {products.map((product, index) => (
              <CategoryProductCard
                key={product.id}
                product={product}
                reverse={index % 2 !== 0}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Product Categories Navigation */}
      <ProductCategories noPaddingTop />

      {/* About Section */}
      <AboutSection />
    </>
  );
};

export default CategoryPage;
