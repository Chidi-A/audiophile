import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CategoryProductCard as ProductType } from '@/types/category';
import { cn } from '@/lib/utils';

type Props = {
  product: ProductType;
  reverse?: boolean;
};

const CategoryProductCard = ({ product, reverse = false }: Props) => {
  const { slug, name, description, isNew, categorySlug, categoryPreviewImage } =
    product;

  if (!categoryPreviewImage) {
    return null; // Skip products without images
  }

  return (
    <article
      className={cn(
        'flex flex-col lg:flex-row items-center gap-8 md:gap-[52px] lg:gap-[125px]',
        reverse && 'lg:flex-row-reverse'
      )}
    >
      {/* Product Image */}
      <div className="w-full lg:w-1/2 shrink-0">
        <div className="relative w-full aspect-square md:aspect-689/704 lg:aspect-square bg-off-white rounded-lg overflow-hidden">
          <picture>
            <source
              media="(min-width: 1024px)"
              srcSet={categoryPreviewImage.desktop}
            />
            <source
              media="(min-width: 768px)"
              srcSet={categoryPreviewImage.tablet}
            />
            <Image
              src={categoryPreviewImage.mobile}
              alt={name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 540px, (min-width: 768px) 689px, 100vw"
            />
          </picture>
        </div>
      </div>

      {/* Product Info */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
        {isNew && (
          <p className="text-[14px] tracking-[10px] text-[#D87D4A] uppercase mb-4 md:mb-6">
            New Product
          </p>
        )}

        <h2 className="text-[28px] md:text-[40px] font-bold uppercase tracking-[1px] md:tracking-[1.43px] mb-6 md:mb-8 max-w-[300px] md:max-w-none">
          {name}
        </h2>

        <p className="text-[15px] leading-[25px] text-black/50 mb-6 md:mb-8 max-w-[572px]">
          {description}
        </p>

        <Button variant="primary" size="custom" asChild>
          <Link href={`/${categorySlug}/${slug}`}>See Product</Link>
        </Button>
      </div>
    </article>
  );
};

export default CategoryProductCard;
