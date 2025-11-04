import Container from '@/components/shared/container';

export default function ProductDetailLoading() {
  return (
    <>
      {/* Go Back Link Skeleton */}
      <section className="bg-black">
        <Container className="py-8 md:py-16">
          <div className="h-5 w-20 bg-white/10 rounded animate-pulse mb-8 md:mb-14" />
        </Container>
      </section>

      {/* Product Hero Skeleton */}
      <section>
        <Container className="py-6 md:py-8 lg:py-14">
          <article className="flex flex-col lg:flex-row items-center gap-8 md:gap-[69px] lg:gap-[125px]">
            {/* Product Image Skeleton */}
            <div className="w-full lg:w-1/2 shrink-0">
              <div className="relative w-full aspect-square md:aspect-689/704 lg:aspect-square bg-gray-200 rounded-lg animate-pulse" />
            </div>

            {/* Product Info Skeleton */}
            <div className="w-full lg:w-1/2 flex flex-col items-start">
              <div className="h-4 w-32 bg-[#D87D4A]/20 rounded animate-pulse mb-4 md:mb-6" />
              <div className="h-10 md:h-12 w-3/4 bg-gray-200 rounded animate-pulse mb-6 md:mb-8" />
              <div className="w-full space-y-3 mb-6 md:mb-8">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-7 w-24 bg-gray-200 rounded animate-pulse mb-8 md:mb-12" />
              <div className="flex items-center gap-4">
                <div className="h-12 w-[120px] bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-[160px] bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </article>
        </Container>
      </section>

      {/* Features & Box Contents Skeleton */}
      <section>
        <Container className="py-16 md:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-[125px]">
            {/* Features */}
            <div className="flex-1">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-8" />
              <div className="space-y-6">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Box Contents */}
            <div className="lg:w-[350px]">
              <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-8" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-5 w-8 bg-[#D87D4A]/20 rounded animate-pulse" />
                    <div className="h-5 flex-1 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery Skeleton */}
      <section>
        <Container className="py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-4 md:space-y-8">
              <div className="w-full aspect-327/174 md:aspect-277/174 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-full aspect-327/174 md:aspect-277/174 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <div className="w-full aspect-327/368 md:aspect-635/592 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </Container>
      </section>

      {/* Related Products Skeleton */}
      <section>
        <Container className="py-16 md:py-20 lg:py-32">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-10 md:mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-[30px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse mb-8" />
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-8" />
                <div className="h-12 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Product Categories Skeleton */}
      <section>
        <Container className="py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-[10px] lg:gap-[30px]">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#F1F1F1] rounded-lg h-[165px] md:h-[204px] animate-pulse"
              />
            ))}
          </div>
        </Container>
      </section>

      {/* About Section Skeleton */}
      <section>
        <Container className="py-16 md:py-24 lg:py-40">
          <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-[125px] items-center">
            <div className="w-full lg:w-1/2 aspect-square md:aspect-689/300 lg:aspect-square bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-4">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
