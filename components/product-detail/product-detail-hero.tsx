'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { ProductDetail } from '@/types/product-detail';
import { addItemToCart } from '@/lib/actions/cart-actions';
import { toast } from 'sonner';
import type { CartItem } from '@/types';

type Props = {
  product: ProductDetail;
};

const ProductDetailHero = ({ product }: Props) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(99, prev + 1));
  };

  const handleAddToCart = async () => {
    if (!product.productImage) return;

    setIsAdding(true);

    // Build CartItem with the selected quantity
    const cartItem: CartItem = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: quantity, // ✅ Use the selected quantity from state
      image: product.productImage.mobile,
    };

    const result = await addItemToCart(cartItem);

    if (result.success) {
      toast.success(result.message);
      setQuantity(1); // Reset quantity selector to 1
    } else {
      toast.error(result.message);
    }

    setIsAdding(false);
  };

  if (!product.productImage) {
    return null;
  }

  return (
    <article className="flex flex-col lg:flex-row items-center gap-8 md:gap-[69px] lg:gap-[125px]">
      {/* Product Image */}
      <div className="w-full lg:w-1/2 shrink-0">
        <div className="relative w-full aspect-square md:aspect-689/704 lg:aspect-square bg-[#F1F1F1] rounded-lg overflow-hidden">
          <picture>
            <source
              media="(min-width: 1024px)"
              srcSet={product.productImage.desktop}
            />
            <source
              media="(min-width: 768px)"
              srcSet={product.productImage.tablet}
            />
            <Image
              src={product.productImage.mobile}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 540px, (min-width: 768px) 689px, 100vw"
              priority
            />
          </picture>
        </div>
      </div>

      {/* Product Info */}
      <div className="w-full lg:w-1/2 flex flex-col items-start">
        {product.isNew && (
          <p className="text-[14px] tracking-[10px] text-[#D87D4A] uppercase mb-4 md:mb-6">
            New Product
          </p>
        )}

        <h1 className="text-[28px] md:text-[40px] font-bold uppercase tracking-[1px] md:tracking-[1.43px] leading-tight mb-6 md:mb-8 max-w-[400px]">
          {product.name}
        </h1>

        <p className="text-[15px] leading-[25px] text-black/50 mb-6 md:mb-8">
          {product.description}
        </p>

        <p className="text-[18px] font-bold tracking-[1.29px] mb-8 md:mb-12">
          {formatPrice(product.price)}
        </p>

        {/* Quantity Selector & Add to Cart */}
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center bg-[#F1F1F1] h-12">
            <button
              onClick={handleDecrement}
              className="w-12 h-full flex items-center justify-center text-black/25 hover:text-[#D87D4A] transition-colors text-[13px] font-bold"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-12 text-center text-[13px] font-bold">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="w-12 h-full flex items-center justify-center text-black/25 hover:text-[#D87D4A] transition-colors text-[13px] font-bold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="primary"
            size="custom"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="h-12"
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductDetailHero;
