'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

const Header = () => {
  const pathname = usePathname();

  // Check if we're on a product detail page (matches /category/product-slug pattern)
  const isProductDetailPage = pathname?.split('/').filter(Boolean).length === 2;

  return (
    <header
      className={cn(
        'w-full border-b pt-8 pb-8 z-10',
        isProductDetailPage
          ? 'bg-black border-b-white/20 relative' // Black background, normal flow
          : 'border-b-white/20 absolute top-0 left-0 right-0' // Transparent, absolute
      )}
    >
      <div className="max-w-[1110px] mx-auto">
        <div className="flex flex-row justify-between items-center wrapper">
          <Link href="/">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              width={143}
              height={25}
              priority={true}
            />
          </Link>
          <div className="flex flex-row gap-8 text-subtitle text-white">
            <Link href="/">Home</Link>
            <Link href="/">Headphones</Link>
            <Link href="/">Speakers</Link>
            <Link href="/">Earphones</Link>
          </div>
          <Link href="/">
            <Image
              src="/images/icon-cart.svg"
              alt={`${APP_NAME} cart icon`}
              width={23}
              height={20}
              priority={true}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
