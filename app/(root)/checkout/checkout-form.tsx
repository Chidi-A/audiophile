'use client';

import type {
  Cart,
  CheckoutForm as CheckoutFormType,
  SerializedOrder,
} from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutFormSchema } from '@/lib/validations/order-schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createOrder } from '@/lib/actions/order-actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { formatPrice, calculateOrderPrices } from '@/lib/utils';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  approvePayPalOrder,
  createPayPalOrder,
  getOrderById,
} from '@/lib/actions/order-actions';
import { createStripePaymentIntent } from '@/lib/stripe';
import StripePayment from './stripe-payment';
import { PaymentSuccessModal } from '@/components/payment-success-modal';
import { completeStripePayment } from '@/lib/actions/stripe-actions';
import { clearCart } from '@/lib/actions/cart-actions';

interface CheckoutFormProps {
  cart: Cart;
  userId: string;
  paypalClientId: string;
}

const CheckoutForm = ({ cart, paypalClientId }: CheckoutFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<SerializedOrder | null>(null);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(
    null
  );

  // Modal state - single source of truth for showing success
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<SerializedOrder | null>(
    null
  );

  // Calculate prices
  const prices = calculateOrderPrices(Number(cart.itemsPrice));

  const form = useForm({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingAddress: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        zipCode: '',
        city: '',
        country: '',
      },
      paymentMethod: 'e-Money',
      saveAddress: false,
      eMoneyNumber: '',
      eMoneyPin: '',
    },
  });

  const paymentMethod = form.watch('paymentMethod');

  // Handle Stripe payment success (called from StripePayment component)
  const handleStripeSuccess = async (paymentIntentId: string) => {
    try {
      const result = await completeStripePayment(paymentIntentId);

      if (result.success && result.order) {
        setCompletedOrder(result.order as SerializedOrder);
        setShowSuccessModal(true);
      } else {
        setError('Failed to complete payment. Please contact support.');
      }
    } catch (error) {
      console.error('Error completing Stripe payment:', error);
      setError('Failed to complete payment. Please contact support.');
    }
  };

  const showSuccessModalWithOrder = async (orderId: string) => {
    const orderResult = await getOrderById(orderId);
    if (orderResult.success && orderResult.data) {
      setCompletedOrder(orderResult.data as SerializedOrder);
      setShowSuccessModal(true);
    }
  };

  const onSubmit = async (data: CheckoutFormType) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createOrder(data);

      if (result.success) {
        // If Stripe payment, create PaymentIntent
        if (data.paymentMethod === 'Stripe' && result.data) {
          setOrderId(result.data);

          const orderResult = await getOrderById(result.data);
          if (orderResult.success && orderResult.data) {
            setOrderData(orderResult.data as SerializedOrder);

            const paymentIntentResult = await createStripePaymentIntent(
              result.data,
              Number(orderResult.data.totalPrice)
            );

            if (
              paymentIntentResult.success &&
              paymentIntentResult.clientSecret
            ) {
              setStripeClientSecret(paymentIntentResult.clientSecret);
            }
          }

          setIsSubmitting(false);
          return;
        }

        // If PayPal payment, store orderId
        if (data.paymentMethod === 'PayPal' && result.data) {
          setOrderId(result.data);

          const orderResult = await getOrderById(result.data);
          if (orderResult.success && orderResult.data) {
            setOrderData(orderResult.data as SerializedOrder);
          }

          setIsSubmitting(false);
          return;
        }

        // For e-Money and Cash on Delivery - show modal immediately
        if (result.data) {
          await showSuccessModalWithOrder(result.data);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Checks the loading status of the PayPal script
  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = '';
    if (isPending) {
      status = 'Loading PayPal...';
    } else if (isRejected) {
      status = 'Error in loading PayPal.';
    }
    return status ? (
      <div className="text-sm text-gray-600 mb-4">{status}</div>
    ) : null;
  }

  // Creates a PayPal order
  const handleCreatePayPalOrder = async () => {
    if (!orderId) return;
    const res = await createPayPalOrder(orderId);
    if (!res.success) {
      setError(res.message);
      return;
    }
    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    if (!orderId) return;
    const res = await approvePayPalOrder(orderId, data);
    if (res.success) {
      await showSuccessModalWithOrder(orderId);
    } else {
      setError(res.message);
    }
  };

  const handleCloseSuccessModal = async () => {
    // Clear cart when user clicks "Back to Home"
    await clearCart();

    setShowSuccessModal(false);
    router.push('/');
    router.refresh();
  };

  return (
    <>
      {/* Success Modal - unified for all payment methods */}
      {showSuccessModal && completedOrder && (
        <PaymentSuccessModal
          open={showSuccessModal}
          order={completedOrder}
          onClose={handleCloseSuccessModal}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Main Form Section */}
        <div className="bg-white rounded-lg p-6 md:p-12">
          <h1 className="text-[2rem] font-bold uppercase tracking-wider mb-8">
            Checkout
          </h1>

          <Form {...form}>
            <form
              id="checkout-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Billing Details */}
              <div>
                <h2 className="text-[0.8125rem] font-bold text-[#D87D4A] uppercase tracking-wider mb-4">
                  Billing Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="shippingAddress.fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Alexei Ward"
                            {...field}
                            className="rounded-lg "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingAddress.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="alexei@mail.com"
                            {...field}
                            className="rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingAddress.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1 202-555-0136"
                            {...field}
                            className="rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Shipping Info */}
              <div>
                <h2 className="text-[0.8125rem] font-bold text-[#D87D4A] uppercase tracking-wider mb-4">
                  Shipping Info
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="shippingAddress.address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-xs font-bold">
                          Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1137 Williams Avenue"
                            {...field}
                            className="rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingAddress.zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold">
                          ZIP Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10001"
                            {...field}
                            className="rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingAddress.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="New York"
                            {...field}
                            className="rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingAddress.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold">
                          Country
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="United States"
                            {...field}
                            className="rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h2 className="text-[0.8125rem] font-bold text-[#D87D4A] uppercase tracking-wider mb-4">
                  Payment Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-xs font-bold">
                          Payment Method
                        </FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <label
                            className={`flex items-center gap-4 border rounded-lg px-4 py-3 cursor-pointer transition-all ${
                              field.value === 'e-Money'
                                ? 'border-[#D87D4A] bg-[#D87D4A]/5'
                                : 'border-gray-300 hover:border-[#D87D4A]'
                            }`}
                          >
                            <input
                              type="radio"
                              value="e-Money"
                              checked={field.value === 'e-Money'}
                              onChange={field.onChange}
                              className="w-5 h-5 accent-[#D87D4A]"
                            />
                            <span className="text-sm font-bold">e-Money</span>
                          </label>

                          <label
                            className={`flex items-center gap-4 border rounded-lg px-4 py-3 cursor-pointer transition-all ${
                              field.value === 'PayPal'
                                ? 'border-[#D87D4A] bg-[#D87D4A]/5'
                                : 'border-gray-300 hover:border-[#D87D4A]'
                            }`}
                          >
                            <input
                              type="radio"
                              value="PayPal"
                              checked={field.value === 'PayPal'}
                              onChange={field.onChange}
                              className="w-5 h-5 accent-[#D87D4A]"
                            />
                            <span className="text-sm font-bold">PayPal</span>
                          </label>

                          <label
                            className={`flex items-center gap-4 border rounded-lg px-4 py-3 cursor-pointer transition-all ${
                              field.value === 'Stripe'
                                ? 'border-[#D87D4A] bg-[#D87D4A]/5'
                                : 'border-gray-300 hover:border-[#D87D4A]'
                            }`}
                          >
                            <input
                              type="radio"
                              value="Stripe"
                              checked={field.value === 'Stripe'}
                              onChange={field.onChange}
                              className="w-5 h-5 accent-[#D87D4A]"
                            />
                            <span className="text-sm font-bold">Stripe</span>
                          </label>

                          <label
                            className={`flex items-center gap-4 border rounded-lg px-4 py-3 cursor-pointer transition-all ${
                              field.value === 'Cash on Delivery'
                                ? 'border-[#D87D4A] bg-[#D87D4A]/5'
                                : 'border-gray-300 hover:border-[#D87D4A]'
                            }`}
                          >
                            <input
                              type="radio"
                              value="Cash on Delivery"
                              checked={field.value === 'Cash on Delivery'}
                              onChange={field.onChange}
                              className="w-5 h-5 accent-[#D87D4A]"
                            />
                            <span className="text-sm font-bold">
                              Cash on Delivery
                            </span>
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {paymentMethod === 'e-Money' && (
                    <>
                      <FormField
                        control={form.control}
                        name="eMoneyNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold">
                              e-Money Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="238521993"
                                {...field}
                                className="rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="eMoneyPin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold">
                              e-Money PIN
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="6891"
                                {...field}
                                className="rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {paymentMethod === 'Cash on Delivery' && (
                    <div className="md:col-span-2 flex gap-6 items-start p-6 bg-gray-50 rounded-lg">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        className="shrink-0"
                      >
                        <path
                          d="M46.594 8.438H42.28c-.448 0-.869.213-1.134.574l-2.694 3.677a15.94 15.94 0 1 0-1.847 2.523l2.694-3.677c.265-.362.614-.555.992-.555h4.314a.838.838 0 0 0 .838-.838v-2.128a.838.838 0 0 0-.838-.838ZM24 30.636A10.636 10.636 0 0 1 24 9.364a10.636 10.636 0 0 1 0 21.272Z"
                          fill="#D87D4A"
                        />
                        <path
                          d="M32 20.636a8 8 0 1 0-16 0 8 8 0 0 0 16 0Z"
                          fill="#D87D4A"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          The &apos;Cash on Delivery&apos; option enables you to
                          pay in cash when our delivery courier arrives at your
                          residence. Just make sure your address is correct so
                          that your order will not be cancelled.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </form>
          </Form>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-lg p-6 md:p-8 h-fit">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-8">
            Summary
          </h2>

          {/* Cart Items */}
          <div className="space-y-6 mb-6">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={item.image || '/images/placeholder.png'}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[0.9375rem] truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600 font-bold">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <span className="text-sm text-gray-600 font-bold">
                  x{item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-[0.9375rem] text-gray-600 uppercase">
                Total
              </span>
              <span className="text-lg font-bold">
                {formatPrice(cart.itemsPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.9375rem] text-gray-600 uppercase">
                Shipping
              </span>
              <span className="text-lg font-bold">${prices.shippingPrice}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.9375rem] text-gray-600 uppercase">
                VAT (Included)
              </span>
              <span className="text-lg font-bold">
                ${prices.taxPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-[0.9375rem] text-gray-600 uppercase">
              Grand Total
            </span>
            <span className="text-lg font-bold text-[#D87D4A]">
              ${prices.totalPrice.toFixed(2)}
            </span>
          </div>

          {/* Submit Button or PayPal Button */}
          {!orderId ? (
            <Button
              type="submit"
              form="checkout-form"
              variant="primary"
              size="custom"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Continue & Pay'}
            </Button>
          ) : (
            orderData &&
            !orderData.isPaid &&
            orderData.paymentMethod === 'PayPal' && (
              <div>
                <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                  <PrintLoadingState />
                  <PayPalButtons
                    createOrder={handleCreatePayPalOrder}
                    onApprove={handleApprovePayPalOrder}
                  />
                </PayPalScriptProvider>
              </div>
            )
          )}

          {/* Stripe Payment */}
          {orderData &&
            !orderData.isPaid &&
            orderData.paymentMethod === 'Stripe' &&
            stripeClientSecret && (
              <div>
                <StripePayment
                  priceInCents={Math.round(Number(orderData.totalPrice) * 100)}
                  orderId={orderData.id}
                  clientSecret={stripeClientSecret}
                  onSuccess={handleStripeSuccess}
                />
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;
