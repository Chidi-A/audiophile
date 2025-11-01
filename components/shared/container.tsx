import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

const Container = ({ children, className, innerClassName }: ContainerProps) => {
  return (
    <div className={cn('px-[5%]', className)}>
      <div
        className={cn(
          'w-full max-w-[1110px] mx-auto relative z-10',
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
