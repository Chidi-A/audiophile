'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signInUser } from '@/lib/actions/auth-actions';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const SignInForm = () => {
  const [data, action] = useActionState(signInUser, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    if (data?.success) {
      window.location.href = callbackUrl;
    }
  }, [data?.success, callbackUrl]);

  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button
        className="w-full"
        variant="primary"
        size="custom"
        type="submit"
        disabled={pending}
      >
        {pending ? 'Signing In...' : 'Sign In'}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            autoComplete="email"
            className="h-12 mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            className="h-12 mt-1"
          />
        </div>

        <div>
          <SignInButton />
        </div>

        {data && !data.success && data.message && (
          <div className="text-center text-destructive text-sm bg-red-50 p-3 rounded-md border border-red-200">
            {data.message}
          </div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href={`/sign-up?callbackUrl=${callbackUrl}`}
            className="text-[#D87D4A] hover:underline font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
