import Hero from '@/components/home/hero';
import ProductCategories from '@/components/shared/product-categories';
import FeaturedProductCard from '@/components/home/featured-product-card';
import SecondaryProductTile from '@/components/home/secondary-product-tile';
import AboutSection from '@/components/shared/about-section';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <ProductCategories />
      <FeaturedProductCard />
      <SecondaryProductTile />
      <AboutSection />
    </div>
  );
};

export default HomePage;
