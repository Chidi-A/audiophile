import type { BoxContentItem } from '@/types/product-detail';

type Props = {
  features: string;
  boxContents: BoxContentItem[];
};

const ProductFeatures = ({ features, boxContents }: Props) => {
  // Split features by double newlines to create paragraphs
  const featureParagraphs = features
    .split('\n\n')
    .filter((paragraph) => paragraph.trim());

  return (
    <div className="flex flex-col lg:flex-row gap-16 lg:gap-[125px]">
      {/* Features */}
      <div className="flex-1">
        <h2 className="text-[24px] md:text-[32px] font-bold uppercase tracking-[0.86px] md:tracking-[1.14px] mb-6 md:mb-8">
          Features
        </h2>
        <div className="space-y-6">
          {featureParagraphs.map((paragraph, index) => (
            <p key={index} className="text-[15px] leading-[25px] text-black/50">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* In the Box */}
      <div className="lg:w-[350px] shrink-0">
        <h2 className="text-[24px] md:text-[32px] font-bold uppercase tracking-[0.86px] md:tracking-[1.14px] mb-6 md:mb-8">
          In the Box
        </h2>
        <ul className="space-y-2">
          {boxContents.map((item, index) => (
            <li key={index} className="flex items-center gap-6">
              <span className="text-[15px] font-bold text-[#D87D4A] w-4">
                {item.quantity}x
              </span>
              <span className="text-[15px] leading-[25px] text-black/50">
                {item.item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductFeatures;
