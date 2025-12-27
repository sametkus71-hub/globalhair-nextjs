import { TreatmentsCarousel } from './TreatmentsCarousel';

export const TreatmentsTabContent = () => {
  return (
    <div id="treatments-tab-content" className="h-full">
      {/* SEO: Visually hidden but accessible to search engines */}
      <h1 className="sr-only">GlobalHair Institute - Premium Haartransplantatie Nederland</h1>
      <h2 className="sr-only">Haartransplantatie Pakketten: Standard, Premium en Elite</h2>
      <TreatmentsCarousel />
    </div>
  );
};