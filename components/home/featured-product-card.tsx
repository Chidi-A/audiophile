import Container from '../shared/container';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';

const FeaturedProductCard = () => {
  return (
    <section>
      <Container>
        <div className="relative bg-primary-orange flex justify-end pt-[133px] pb-[124px] pr-[95px] rounded-[8px] overflow-hidden">
          <div className="absolute top-[-100px] left-[-180px] ">
            <Image
              src="/images/pattern-circles.svg"
              alt="Featured Product Card"
              width={1000}
              height={1000}
            />
          </div>
          <div className="absolute  left-[118px]  bottom-[-32px]">
            <Image
              src="/images/image-zx9-speaker.png"
              alt="ZX9 Speaker"
              width={410}
              height={493}
            />
          </div>
          <div className="max-w-[349px] flex flex-col gap-10 relative z-10">
            <div className="flex flex-col gap-6 text-white">
              <h1>ZX9 Speaker</h1>
              <p>
                Upgrade to premium speakers that are phenomenally built to
                deliver truly remarkable sound.
              </p>
            </div>
            <Button variant="black" size="custom" className="w-fit asChild">
              <Link href="/">See Product</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProductCard;
