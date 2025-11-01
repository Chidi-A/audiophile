import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';

const Header = () => {
  return (
    <header className="w-full border-b max-w-[1110px] mx-auto pt-8 pb-8 border-b-white/20 absolute top-0 left-0 right-0 z-10">
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
          <Link href="/">Headphones</Link>
          <Link href="/">Speakers</Link>
          <Link href="/">Earphones</Link>
        </div>
        <Link href="/">
          <Image
            src="/images/icon-cart.svg"
            alt={`${APP_NAME} cart icon`}
            width={23}
            height={20}
            priority={true}
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
