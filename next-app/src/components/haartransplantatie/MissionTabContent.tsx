import { BerkantVideoCard } from './BerkantVideoCard';
import { OzlemVideoCard } from './OzlemVideoCard';

export const MissionTabContent = () => {
  return (
    <div id="mission-tab-content" className="h-full w-full flex flex-col lg:flex-row gap-2 lg:gap-0 items-center justify-center">
      <BerkantVideoCard />
      <OzlemVideoCard />
    </div>
  );
};