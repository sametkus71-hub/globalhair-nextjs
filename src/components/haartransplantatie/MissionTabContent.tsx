import { BerkantVideoCard } from './BerkantVideoCard';
import { OzlemVideoCard } from './OzlemVideoCard';

export const MissionTabContent = () => {
  return (
    <div className="h-full w-full flex flex-col lg:flex-row gap-2 lg:gap-0 items-center justify-center">
      <BerkantVideoCard />
      <OzlemVideoCard />
    </div>
  );
};