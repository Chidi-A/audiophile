import Container from './container';
import Image from 'next/image';

const AboutSection = () => {
  return (
    <section className="pb-50">
      <Container>
        <div>
          <div className="grid grid-cols-2  items-center">
            <div className="flex flex-col gap-8 max-w-[445px]">
              <h2>
                Bringing you the{' '}
                <span className="text-primary-orange">best</span> audio gear
              </h2>
              <p className="text-body text-black opacity-50">
                Located at the heart of New York City, Audiophile is the premier
                store for high end headphones, earphones, speakers, and audio
                accessories. We have a large showroom and luxury demonstration
                rooms available for you to browse and experience a wide range of
                our products. Stop by our store to meet some of the fantastic
                people who make Audiophile the best place to buy your portable
                audio equipment.
              </p>
            </div>
            <div className="relative rounded-[8px] overflow-hidden">
              <Image
                src="/images/image-best-gear.jpg"
                alt="About Hero"
                width={1000}
                height={1000}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;
