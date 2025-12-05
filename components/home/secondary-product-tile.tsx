import Container from '../shared/container';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

const SecondaryProductTile = () => {
  return (
    <section className="lg:pt-12 pt-6 pb-30 lg:pb-50">
      <Container>
        <div className="grid grid-cols-1 lg:grid-rows-2 lg:gap-12 gap-6">
          <div className="relative py-[101px] lg:pl-[95px] pl-6 rounded-[8px] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 bottom-0">
              {/* Mobile Image */}
              <Image
                src="/assets/home/mobile/image-speaker-zx7.jpg"
                alt="Speaker ZX7"
                width={1000}
                height={1000}
                className="w-full h-full object-cover md:hidden"
              />
              {/* Tablet Image */}
              <Image
                src="/assets/home/tablet/image-speaker-zx7.jpg"
                alt="Speaker ZX7"
                width={1000}
                height={1000}
                className="w-full h-full object-cover hidden md:block lg:hidden"
              />
              {/* Desktop Image */}
              <Image
                src="/images/image-speaker-zx7.jpg"
                alt="Speaker ZX7"
                width={1000}
                height={1000}
                className="w-full h-full object-cover hidden lg:block"
              />
            </div>
            <div className="flex flex-col gap-6 relative z-10">
              <h4>ZX7 Speaker</h4>
              <Button variant="stroke" size="custom" className="w-fit asChild">
                <Link href="/speakers/zx7-speaker">See Product</Link>
              </Button>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-[30px] gap-6 ">
            <div className="relative rounded-[8px] overflow-hidden">
              <Image
                src="/images/image-earphones-yx1.jpg"
                alt="Earphones YX1"
                width={1000}
                height={1000}
              />
            </div>
            <div className="lg:px-[95px] lg:py-[101px] px-6 py-14 bg-off-white rounded-[8px]">
              <div className="flex flex-col gap-6 relative z-10">
                <h4>YX1 Earphones</h4>
                <Button
                  variant="stroke"
                  size="custom"
                  className="w-fit asChild"
                >
                  <Link href="/earphones/yx1-earphones">See Product</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SecondaryProductTile;
