import Container from '../shared/container';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

const SecondaryProductTile = () => {
  return (
    <section className="pt-12 pb-50">
      <Container>
        <div className="grid grid-cols-1 grid-rows-2 gap-12">
          <div className="relative py-[101px] pl-[95px] rounded-[8px] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 bottom-0">
              <Image
                src="/images/image-speaker-zx7.jpg"
                alt="Speaker ZX7"
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-6 relative z-10">
              <h4>ZX7 Speaker</h4>
              <Button variant="stroke" size="custom" className="w-fit asChild">
                <Link href="/speakers/zx7-speaker">See Product</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[30px] ">
            <div className="relative rounded-[8px] overflow-hidden">
              <Image
                src="/images/image-earphones-yx1.jpg"
                alt="Earphones YX1"
                width={1000}
                height={1000}
              />
            </div>
            <div className="px-[95px] py-[101px] bg-off-white rounded-[8px]">
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
