import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { BeforeAfterGrid } from '@/components/haartransplantatie/BeforeAfterGrid';
import { VideoPlaySection } from '@/components/haartransplantatie/VideoPlaySection';
import { BottomNavigation } from '@/components/haartransplantatie/BottomNavigation';

const HaartransplantatiePage = () => {
  const { language } = useLanguage();

  return (
    <>
      <MetaHead language={language} page="haartransplantatie" />
      <PageTransition isNewPage={true}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col relative overflow-hidden">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Top Section - Before/After Grid */}
          <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
            <div 
              className="page-entry-item page-entry-delay-1"
              data-page-entry="grid"
            >
              <BeforeAfterGrid />
            </div>
          </div>

          {/* Middle Section - Space for Global Logo (handled by GlobalCentralLogo) */}
          <div className="h-24" />

          {/* Bottom Section - Video Play & Controls */}
          <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
            <div 
              className="page-entry-item page-entry-delay-2"
              data-page-entry="video"
            >
              <VideoPlaySection />
            </div>
          </div>

          {/* Fixed Bottom Navigation */}
          <BottomNavigation />
        </div>
      </PageTransition>
    </>
  );
};

export default HaartransplantatiePage;