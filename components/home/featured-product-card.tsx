import Container from '../shared/container';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';

const FeaturedProductCard = () => {
  return (
    <section>
      <Container>
        <div className="relative bg-primary-orange flex flex-col lg:flex-row lg:justify-end items-center lg:items-stretch pt-14 pb-14 px-6 lg:pt-[133px] lg:pb-[124px] lg:pr-[95px] rounded-[8px] overflow-hidden">
          {/* Background Pattern Circles */}
          <div className="absolute top-[-30px] md:top-[-50px] lg:top-[-100px] left-1/2 lg:left-[-180px] transform -translate-x-1/2 lg:translate-x-0 scale-[0.6] md:scale-75 lg:scale-100">
            <Image
              src="/images/pattern-circles.svg"
              alt="Featured Product Card"
              width={1000}
              height={1000}
            />
          </div>

          {/* Speaker Image - Mobile */}
          <div className="relative z-10 md:hidden mb-8">
            <Image
              src="/assets/home/mobile/image-speaker-zx9.png"
              alt="ZX9 Speaker"
              width={172}
              height={207}
            />
          </div>

          {/* Speaker Image - Tablet */}
          <div className="relative z-10 hidden md:block lg:hidden mb-12">
            <Image
              src="/assets/home/tablet/image-speaker-zx9.png"
              alt="ZX9 Speaker"
              width={197}
              height={237}
            />
          </div>

          {/* Speaker Image - Desktop */}
          <div className="absolute hidden lg:block left-[118px] bottom-[-32px]">
            <Image
              src="/images/image-zx9-speaker.png"
              alt="ZX9 Speaker"
              width={410}
              height={493}
            />
          </div>

          {/* Content */}
          <div className="max-w-[349px] flex flex-col gap-6 lg:gap-10 relative z-10 text-center lg:text-left items-center lg:items-start">
            <div className="flex flex-col gap-6 text-white">
              <h1>ZX9 Speaker</h1>
              <p>
                Upgrade to premium speakers that are phenomenally built to
                deliver truly remarkable sound.
              </p>
            </div>
            <Button variant="black" size="custom" className="w-fit asChild">
              <Link href="/speakers/zx9-speaker">See Product</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProductCard;
