import Image from 'next/image';
import type { GalleryImage } from '@/types/product-detail';

type Props = {
  images: GalleryImage[];
};

const ProductGallery = ({ images }: Props) => {
  if (images.length === 0) return null;

  // Organize images by type
  const gallery1 = images.find((img) => img.type === 'GALLERY_1');
  const gallery2 = images.find((img) => img.type === 'GALLERY_2');
  const gallery3 = images.find((img) => img.type === 'GALLERY_3');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.4fr] gap-4 md:gap-5 lg:gap-8">
      {/* Left Column - Two smaller images stacked */}
      <div className="flex flex-col gap-4 md:gap-5 lg:gap-8">
        {gallery1 && (
          <div className="relative w-full aspect-[327/174] md:aspect-[277/174] lg:aspect-[445/280] bg-[#F1F1F1] rounded-lg overflow-hidden">
            <picture>
              <source
                media="(min-width: 1024px)"
                srcSet={gallery1.urls.desktop}
              />
              <source
                media="(min-width: 768px)"
                srcSet={gallery1.urls.tablet}
              />
              <Image
                src={gallery1.urls.mobile}
                alt="Product gallery image 1"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 445px, (min-width: 768px) 277px, 327px"
              />
            </picture>
          </div>
        )}

        {gallery2 && (
          <div className="relative w-full aspect-[327/174] md:aspect-[277/174] lg:aspect-[445/280] bg-[#F1F1F1] rounded-lg overflow-hidden">
            <picture>
              <source
                media="(min-width: 1024px)"
                srcSet={gallery2.urls.desktop}
              />
              <source
                media="(min-width: 768px)"
                srcSet={gallery2.urls.tablet}
              />
              <Image
                src={gallery2.urls.mobile}
                alt="Product gallery image 2"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 445px, (min-width: 768px) 277px, 327px"
              />
            </picture>
          </div>
        )}
      </div>

      {/* Right Column - One large image */}
      {gallery3 && (
        <div className="relative w-full aspect-[327/368] md:aspect-[395/592] lg:aspect-[635/592] bg-[#F1F1F1] rounded-lg overflow-hidden">
          <picture>
            <source
              media="(min-width: 1024px)"
              srcSet={gallery3.urls.desktop}
            />
            <source media="(min-width: 768px)" srcSet={gallery3.urls.tablet} />
            <Image
              src={gallery3.urls.mobile}
              alt="Product gallery image 3"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 635px, (min-width: 768px) 395px, 327px"
            />
          </picture>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
