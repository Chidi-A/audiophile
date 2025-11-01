import Link from 'next/link';
import Container from './shared/container';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <Container>
        <div className="pt-[75px] pb-12 relative z-10">
          <div className="absolute top-0 left-0 w-[101px] h-1 bg-primary-orange"></div>
          <div className="flex flex-row justify-between items-center">
            <div className="max-w-[143px]">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={143}
                height={25}
              />
            </div>
            <div className="flex flex-row gap-8">
              <Link className="text-subtitle" href="/">
                Home
              </Link>
              <Link className="text-subtitle" href="/">
                Headphones
              </Link>
              <Link className="text-subtitle" href="/">
                Speakers
              </Link>
              <Link className="text-subtitle" href="/">
                Earphones
              </Link>
            </div>
          </div>
          <div className="flex flex-row justify-between items-end h-full mt-8">
            <p className="text-body text-white opacity-50 max-w-[540px]">
              Audiophile is an all in one stop to fulfill your audio needs.
              We&apos;re a small team of music lovers and sound specialists who
              are devoted to helping you get the most out of personal audio.
              Come and visit our demo facility - we&apos;re open 7 days a week.
            </p>
            <div className="flex flex-row gap-4 items-center">
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
          <div className="flex flex-row justify-between items-center mt-12">
            <p className="text-body text-white opacity-50">
              Copyright 2025. All Rights Reserved
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
