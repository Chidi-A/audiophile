import Container from './container';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ProductCategories = () => {
  return (
    <section>
      <Container className="pt-30 pb-48">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          <div className="relative pt-[116px] pb-[30px] bg-off-white flex flex-col items-center justify-center gap-4 mt-20 rounded-[8px]">
            <div className="absolute top-[-80px] left-0 right-0 flex justify-center">
              <Image
                src="/images/image-category-thumbnail-headphone.png"
                alt="Headphones"
                width={123}
                height={160}
              />
              <div className="w-32 h-6 bg-black/30 rounded-full blur-md -mt-2 absolute bottom-[-10px]" />
            </div>
            <h6>Headphones</h6>
            <Button variant="text-icon" size="icon" className="w-fit" asChild>
              <Link href="/">
                Shop <ChevronRight className="size-4 text-[#D87D4A]" />
              </Link>
            </Button>
          </div>
          <div className="relative pt-[116px] pb-[30px] bg-off-white flex flex-col items-center justify-center gap-4 mt-20 rounded-[8px]">
            <div className="absolute top-[-72px] left-0 right-0 flex justify-center">
              <Image
                src="/images/image-category-thumbnail-speakers.png"
                alt="Speakers"
                width={121}
                height={146}
              />
              <div className="w-32 h-6 bg-black/30 rounded-full blur-md -mt-2 absolute bottom-[-10px]" />
            </div>
            <h6>Speakers</h6>
            <Button variant="text-icon" size="icon" className="w-fit" asChild>
              <Link href="/">
                Shop <ChevronRight className="size-4 text-[#D87D4A]" />
              </Link>
            </Button>
          </div>
          <div className="relative pt-[116px] pb-[30px] bg-off-white flex flex-col items-center justify-center gap-4 mt-20 rounded-[8px]">
            <div className="absolute top-[-60px] left-0 right-0 flex justify-center">
              <Image
                src="/images/image-category-thumbnail-earphones.png"
                alt="Earphones"
                width={125}
                height={126}
              />
              <div className="w-32 h-6 bg-black/30 rounded-full blur-md -mt-2 absolute bottom-[-10px]" />
            </div>
            <h6>Earphones</h6>
            <Button variant="text-icon" size="icon" className="w-fit" asChild>
              <Link href="/">
                Shop <ChevronRight className="size-4 text-[#D87D4A]" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProductCategories;
