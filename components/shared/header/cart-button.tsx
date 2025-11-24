'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CartModal from '@/components/cart/cart-modal';
import { getCartItemCount } from '@/lib/actions/cart-actions';

export default function CartButton() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  // Load item count for the badge
  useEffect(() => {
    const loadCount = async () => {
      const count = await getCartItemCount();
      setItemCount(count);
    };

    loadCount();

    // Also reload when cart modal closes (to update badge)
    if (!isCartOpen) {
      loadCount();
    }
  }, [isCartOpen]);

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative"
        aria-label="Open cart"
      >
        <Image
          src="/images/icon-cart.svg"
          alt="Cart"
          width={23}
          height={20}
          priority={true}
        />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#D87D4A] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
            {itemCount}
          </span>
        )}
      </button>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
