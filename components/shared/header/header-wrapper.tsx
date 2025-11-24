'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function HeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if we're on a product detail page (matches /category/product-slug pattern)
  const isProductDetailPage = pathname?.split('/').filter(Boolean).length === 2;

  // Check if we're on the checkout page
  const isCheckoutPage = pathname === '/checkout';

  return (
    <header
      className={cn(
        'w-full border-b pt-8 pb-8 z-50',
        isProductDetailPage || isCheckoutPage
          ? 'bg-black border-b-white/20 relative' // Black background, normal flow
          : 'border-b-white/20 absolute top-0 left-0 right-0' // Transparent, absolute
      )}
    >
      {children}
    </header>
  );
}
