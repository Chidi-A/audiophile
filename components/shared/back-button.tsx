'use client';

import { useRouter } from 'next/navigation';

type Props = {
  fallbackUrl?: string;
  className?: string;
};

const BackButton = ({ fallbackUrl, className }: Props) => {
  const router = useRouter();

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back();
    } else if (fallbackUrl) {
      // If no history (e.g., direct link), go to fallback
      router.push(fallbackUrl);
    }
  };

  return (
    <button onClick={handleBack} className={className} type="button">
      Go Back
    </button>
  );
};

export default BackButton;
