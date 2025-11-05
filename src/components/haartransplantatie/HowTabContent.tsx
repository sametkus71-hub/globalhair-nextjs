import { HeadImage } from './HeadImage';
import { TrajectCardGlass } from './TrajectCardGlass';

export const HowTabContent = () => {
  return (
    <div className="h-full relative">
      {/* Head Image - repositioned inside this tab */}
      <div className="absolute top-0 right-0 z-10">
        <HeadImage />
      </div>
      
      <TrajectCardGlass />
    </div>
  );
};