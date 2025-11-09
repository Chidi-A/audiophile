import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import UserButton from './user-button';
import HeaderWrapper from './header-wrapper';

const Header = () => {
  return (
    <HeaderWrapper>
      <div className="max-w-[1110px] mx-auto">
        <div className="flex flex-row justify-between items-center wrapper">
          <Link href="/">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              width={143}
              height={25}
              priority={true}
            />
          </Link>
          <div className="flex flex-row gap-8 text-subtitle text-white">
            <Link href="/">Home</Link>
            <Link href="/headphones">Headphones</Link>
            <Link href="/speakers">Speakers</Link>
            <Link href="/earphones">Earphones</Link>
          </div>
          <div className="flex flex-row items-center gap-6">
            <Link href="/">
              <Image
                src="/images/icon-cart.svg"
                alt={`${APP_NAME} cart icon`}
                width={23}
                height={20}
                priority={true}
              />
            </Link>
            <UserButton />
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
