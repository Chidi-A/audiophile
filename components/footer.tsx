import Link from 'next/link';
import Container from './shared/container';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <Container>
        <div className="lg:pt-[75px] pt-12 pb-12 relative z-10">
          <div className="absolute top-0 lg:left-0 left-1/2 -translate-x-1/2 w-[101px] h-1 bg-primary-orange"></div>
          <div className="flex lg:flex-row flex-col gap-12 lg:gap-0 lg:justify-between items-center">
            <div className="max-w-[143px]">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={143}
                height={25}
              />
            </div>
            <div className="flex lg:flex-row flex-col lg:gap-8 gap-4 items-center lg:items-start">
              <Link className="text-subtitle" href="/">
                Home
              </Link>
              <Link className="text-subtitle" href="/headphones">
                Headphones
              </Link>
              <Link className="text-subtitle" href="/speakers">
                Speakers
              </Link>
              <Link className="text-subtitle" href="/earphones">
                Earphones
              </Link>
            </div>
          </div>
          <div className="flex lg:flex-row flex-col lg:justify-between lg:items-end items-center h-full mt-8">
            <p className="text-body text-white opacity-50 max-w-[540px] text-center lg:text-left">
              Audiophile is an all in one stop to fulfill your audio needs.
              We&apos;re a small team of music lovers and sound specialists who
              are devoted to helping you get the most out of personal audio.
              Come and visit our demo facility - we&apos;re open 7 days a week.
            </p>
            <div className="lg:flex hidden flex-row gap-4 items-center">
              <Link href="/">
                <Image
                  src="/images/icon-facebook.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href="/">
                <Image
                  src="/images/icon-twitter.svg"
                  alt="Twitter"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href="/">
                <Image
                  src="/images/icon-instagram.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>
          <div className="flex lg:flex-row flex-col lg:justify-between items-center mt-12 gap-12">
            <p className="text-body text-white opacity-50 text-center lg:text-left">
              Copyright 2025. All Rights Reserved
            </p>
            {/* Social icons - Mobile/Tablet only */}
            <div className="flex lg:hidden flex-row gap-4 items-center">
              <Link href="/">
                <Image
                  src="/images/icon-facebook.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href="/">
                <Image
                  src="/images/icon-twitter.svg"
                  alt="Twitter"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href="/">
                <Image
                  src="/images/icon-instagram.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
