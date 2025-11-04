import Container from '@/components/shared/container';

export default function CategoryLoading() {
  return (
    <>
      {/* Category Header Skeleton */}
      <section className="bg-black">
        <Container className="py-24 md:pt-48 pb-24">
          <div className="flex justify-center">
            <div className="h-10 w-48 bg-white/10 rounded animate-pulse" />
          </div>
        </Container>
      </section>

      {/* Product Cards Skeleton */}
      <section>
        <Container className="py-16 md:py-24 lg:py-40">
          <div className="space-y-[120px] md:space-y-[150px] lg:space-y-[160px]">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-8 lg:gap-[125px] items-center"
              >
                {/* Image Skeleton */}
                <div className="w-full md:w-1/2 aspect-square bg-gray-200 rounded-lg animate-pulse" />

                {/* Content Skeleton */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="h-4 w-24 bg-[#D87D4A]/20 rounded animate-pulse" />
                  <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-12 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
