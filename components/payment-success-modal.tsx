'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { SerializedOrder } from '@/types';

interface PaymentSuccessModalProps {
  open: boolean;
  order: SerializedOrder;
}

export function PaymentSuccessModal({ open, order }: PaymentSuccessModalProps) {
  const router = useRouter();

  // Get first item and count remaining
  const firstItem = order.orderItems[0];
  const remainingItems = order.orderItems.length - 1;

  const handleBackToHome = () => {
    router.push('/');
  };
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-[540px] p-8 md:p-12">
        {/* Success Icon */}
        <div className="flex  mb-6">
          <Image
            src="/assets/checkout/icon-order-confirmation.svg"
            alt="Success"
            className="w-16 h-16 object-contain"
            width={64}
            height={64}
          />
        </div>

        {/* Title */}
        <DialogTitle className="text-2xl md:text-[2rem] font-bold uppercase mb-4 leading-tight">
          Thank you
          <br />
          for your order
        </DialogTitle>

        {/* Description */}
        <DialogDescription className="text-[0.9375rem] text-gray-600 mb-6">
          You will receive an email confirmation shortly.
        </DialogDescription>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 mb-8 rounded-lg overflow-hidden">
          {/* Products Section */}
          <div className="bg-gray-100 p-6">
            {/* First Item */}
            {firstItem && (
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0">
                  <Image
                    src={firstItem.image || '/images/placeholder.png'}
                    alt={firstItem.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[0.9375rem] truncate">
                    {firstItem.name}
                  </p>
                  <p className="text-sm text-gray-600 font-bold">
                    {formatPrice(firstItem.price)}
                  </p>
                </div>
                <span className="text-sm text-gray-600 font-bold">
                  x{firstItem.qty}
                </span>
              </div>
            )}

            {/* Remaining Items Count */}
            {remainingItems > 0 && (
              <>
                <div className="border-t border-gray-300 my-3" />
                <p className="text-xs text-gray-600 text-center font-bold">
                  and {remainingItems} other item{remainingItems > 1 ? 's' : ''}
                </p>
              </>
            )}
          </div>

          {/* Grand Total Section */}
          <div className="bg-black text-white p-6 flex flex-col items-center justify-center md:min-w-[198px]">
            <p className="text-[0.9375rem] text-gray-400 uppercase mb-2">
              Grand Total
            </p>
            <p className="text-lg font-bold">${order.totalPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Back to Home Button */}
        <Button
          onClick={handleBackToHome}
          variant="primary"
          size="custom"
          className="w-full"
        >
          Back to Home
        </Button>
      </DialogContent>
    </Dialog>
  );
}
