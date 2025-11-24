'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';
import {
  getMyCart,
  updateCartItemQuantity,
  clearCart,
} from '@/lib/actions/cart-actions';
import { toast } from 'sonner';

type CartModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Load cart data when modal opens
  useEffect(() => {
    const loadCart = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        const cart = await getMyCart();
        if (cart) {
          setItems(cart.items as CartItem[]);
        } else {
          setItems([]);
        }
      } catch (error) {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isOpen]);

  const handleUpdateQuantity = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 0 || newQuantity > 99) return;

    setIsUpdating(true);

    const result = await updateCartItemQuantity(productId, newQuantity);

    if (result.success) {
      if (newQuantity === 0) {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
        toast.success('Item removed from cart');
      } else {
        setItems((prev) =>
          prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      }
    } else {
      toast.error(result.message);
    }

    setIsUpdating(false);
  };

  const handleClearCart = async () => {
    setIsUpdating(true);
    const result = await clearCart();

    if (result.success) {
      setItems([]);
      toast.success('Cart cleared');
    } else {
      toast.error(result.message);
    }
    setIsUpdating(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Cart Content */}
        <Dialog.Content className="fixed top-[100px] right-4 md:right-8 lg:right-[165px] z-50 w-[calc(100vw-2rem)] max-w-[377px] bg-white rounded-lg p-8 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Dialog.Title className="text-lg font-bold tracking-[1.29px] uppercase">
              Cart ({itemCount})
            </Dialog.Title>
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                disabled={isUpdating}
                className="text-[15px] text-black/50 hover:text-[#D87D4A] underline transition-colors"
              >
                Remove all
              </button>
            )}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-8 flex items-center justify-center">
              <p className="text-black/50 text-[15px]">Loading...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-8 flex items-center justify-center">
              <p className="text-black/50 text-[15px]">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-6 mb-8 max-h-[340px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-[#F1F1F1] rounded-lg overflow-hidden shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-bold truncate">
                        {item.name}
                      </h3>
                      <p className="text-[14px] text-black/50 font-bold">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center bg-[#F1F1F1] h-8">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        disabled={isUpdating}
                        className="w-8 h-full flex items-center justify-center text-black/25 hover:text-[#D87D4A] transition-colors text-[13px] font-bold disabled:opacity-50"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span className="w-8 text-center text-[13px] font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                        disabled={isUpdating || item.quantity >= 99}
                        className="w-8 h-full flex items-center justify-center text-black/25 hover:text-[#D87D4A] transition-colors text-[13px] font-bold disabled:opacity-50"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] text-black/50 uppercase">
                    Total
                  </span>
                  <span className="text-[18px] font-bold">
                    {formatPrice(total)}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="custom"
                  className="w-full"
                  asChild
                  onClick={onClose}
                >
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CartModal;
