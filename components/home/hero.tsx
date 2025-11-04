import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import Container from '../shared/container';

const Hero = () => {
  return (
    <section className=" bg-center  relative">
      <div className="absolute top-0 left-0 right-0 bottom-0">
        <Image
          src="/images/image-hero.jpg"
          alt="Hero"
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
        />
      </div>
      <Container>
        <div className="flex items-center justify-start h-svh max-h-207">
          <div className="max-w-160 flex flex-col gap-10">
            <div className="flex flex-col gap-6 ">
              <div className="text-overline text-white opacity-50 tracking-[10px]">
                New Product
              </div>
              <h1 className="text-white">XX99 Mark II Headphones</h1>
              <p className="text-body text-white opacity-70 max-w-[350px]">
                Experience natural, lifelike audio and exceptional build quality
                made for the passionate music enthusiast.
              </p>
            </div>
            <Button variant="primary" size="custom" className="w-fit asChild">
              <Link href="/headphones/xx99-mark-two-headphones">
                See Product
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
