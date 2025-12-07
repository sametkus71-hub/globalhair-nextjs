import Lottie from 'lottie-react';
import loaderAnimation from '@/assets/loader-animation.json';

interface LottiePageLoaderProps {
  isVisible?: boolean;
}

export const LottiePageLoader = ({ isVisible = true }: LottiePageLoaderProps) => {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{ 
        pointerEvents: 'all',
        touchAction: 'none'
      }}
    >
      <div className="w-40 h-40 sm:w-52 sm:h-52">
        <Lottie 
          animationData={loaderAnimation} 
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
};

export default LottiePageLoader;
