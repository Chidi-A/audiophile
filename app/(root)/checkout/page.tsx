import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getMyCart } from '@/lib/actions/cart-actions';
import CheckoutForm from './checkout-form';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default async function CheckoutPage() {
  const session = await auth();

  // Redirect to sign in if not authenticated
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/checkout');
  }

  // Get cart data
  const cart = await getMyCart();

  // Redirect to home if cart is empty
  if (!cart || cart.items.length === 0) {
    redirect('/');
  }

  return (
    <div className="bg-off-white">
      <div className="container mx-auto px-6 py-12 ">
        <Link
          href="/"
          className="text-base text-gray-600 hover:text-[#D87D4A] mb-8 inline-block"
        >
          Go Back
        </Link>

        <CheckoutForm
          cart={cart}
          userId={session.user.id as string}
          paypalClientId={process.env.PAYPAL_CLIENT_ID as string}
        />
      </div>
    </div>
  );
}
