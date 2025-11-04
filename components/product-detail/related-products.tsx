import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { RelatedProductCard } from '@/types/product-detail';
import { formatProductName } from '@/lib/utils';

type Props = {
  products: RelatedProductCard[];
};

const RelatedProducts = ({ products }: Props) => {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="text-[24px] md:text-[32px] font-bold uppercase tracking-[0.86px] md:tracking-[1.14px] text-center mb-10 md:mb-14 lg:mb-16">
        You May Also Like
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-[11px] lg:gap-[30px]">
        {products.map((product) => (
          <article
            key={product.id}
            className="flex flex-col items-center text-center"
          >
            {/* Product Image */}
            {product.previewImage && (
              <div className="relative w-full aspect-square bg-[#F1F1F1] rounded-lg overflow-hidden mb-8 md:mb-10">
                <picture>
                  <source
                    media="(min-width: 1024px)"
                    srcSet={product.previewImage.desktop}
                  />
                  <source
                    media="(min-width: 768px)"
                    srcSet={product.previewImage.tablet}
                  />
                  <Image
                    src={product.previewImage.mobile}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 350px, (min-width: 768px) 223px, 100vw"
                  />
                </picture>
              </div>
            )}

            {/* Product Name */}
            <h3 className="text-[24px] font-bold uppercase tracking-[1.71px] mb-8">
              {formatProductName(product.name, product.categorySlug)}
            </h3>

            {/* See Product Button */}
            <Button variant="primary" size="custom" asChild>
              <Link href={`/${product.categorySlug}/${product.slug}`}>
                See Product
              </Link>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
