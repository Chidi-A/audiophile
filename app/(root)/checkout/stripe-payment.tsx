import { Button } from '@/components/ui/button';
import { SERVER_URL } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';

import { FormEvent, useState } from 'react';

const StripePayment = ({
  priceInCents,
  orderId,
  clientSecret,
  onSuccess,
}: {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
}) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const StripeForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [email, setEmail] = useState<string>();

    // Handle StripeForm submission
    async function handleSubmit(e: FormEvent) {
      e.preventDefault();
      if (stripe == null || elements == null || email == null) return;
      setIsLoading(true);
      //   stripe
      //     .confirmPayment({
      //       elements,
      //       confirmParams: {
      //         return_url: `${SERVER_URL}/checkout`,
      //       },
      //     })
      //     .then(({ error }) => {
      //       if (
      //         error?.type === 'card_error' ||
      //         error?.type === 'validation_error'
      //       ) {
      //         setErrorMessage(error?.message ?? 'An unknown error occurred.');
      //       } else if (error) {
      //         setErrorMessage('An unknown error occurred.');
      //       }
      //     })
      //     .finally(() => setIsLoading(false));
      // }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          receipt_email: email,
        },
        redirect: 'if_required', // Only redirect if required by payment method
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message ?? 'An unknown error occurred.');
        } else {
          setErrorMessage('An unknown error occurred.');
        }
        setIsLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful! Call the success handler
        onSuccess(paymentIntent.id);
      }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-xl">Stripe Checkout</div>
        {errorMessage && <div className="text-destructive">{errorMessage}</div>}
        <PaymentElement />
        <div>
          <LinkAuthenticationElement
            onChange={(e) => setEmail(e.value.email)}
          />
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={stripe == null || elements == null || isLoading}
        >
          {isLoading
            ? 'Purchasing...'
            : `Purchase - ${formatPrice(priceInCents)}`}
        </Button>
      </form>
    );
  };

  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <StripeForm />
    </Elements>
  );
};

export default StripePayment;
