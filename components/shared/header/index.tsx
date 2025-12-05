'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import UserButton from './user-button';
import HeaderWrapper from './header-wrapper';
import CartButton from './cart-button';
import ProductCategories from '../product-categories';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/headphones', label: 'Headphones' },
    { href: '/speakers', label: 'Speakers' },
    { href: '/earphones', label: 'Earphones' },
  ];

  return (
    <HeaderWrapper>
      <div className="max-w-[1110px] mx-auto px-6 md:px-10 lg:px-0">
        <div className="flex flex-row justify-between items-center">
          {/* Mobile & Tablet Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <button
                aria-label="Open menu"
                className="text-white hover:text-raw-sienna transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="top"
              className="bg-white w-full h-auto max-h-[90vh] overflow-y-auto pt-20"
            >
              <div onClick={() => setIsMenuOpen(false)}>
                <ProductCategories noPaddingTop={true} className="pt-0 pb-8" />
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="lg:order-0 order-1">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              width={143}
              height={25}
              priority={true}
            />
          </Link>

          {/* Desktop Navigation - Hidden on tablet and mobile */}
          <nav className="hidden lg:flex flex-row gap-8 text-subtitle text-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-raw-sienna transition-colors uppercase tracking-[0.125rem]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex flex-row items-center gap-6 lg:order-0 order-2">
            <CartButton />
            <UserButton />
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
