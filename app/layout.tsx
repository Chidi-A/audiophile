import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import '@/assets/styles/globals.css';
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/lib/constants';
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME}`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
  icons: {
    icon: '/assets/favicon-32x32.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        <SessionProvider>
          {children} <Toaster position="top-center" richColors />{' '}
        </SessionProvider>
      </body>
    </html>
  );
}
