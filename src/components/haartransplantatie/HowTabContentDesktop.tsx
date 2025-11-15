import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

type Phase = 'Pre-' | 'Treatment' | 'After-';

export const HowTabContentDesktop = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activePhase, setActivePhase] = useState<Phase>('Treatment');

  // Detect iOS/Safari for proper video format
  const isIOSorSafari = useMemo(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    return isIOS || isSafari;
  }, []);

  const phases: Phase[] = ['Pre-', 'Treatment', 'After-'];

  // Get content for specific phase
  const getPhaseContent = (phase: Phase) => {
    switch (phase) {
      case 'Pre-':
        return {
          quote: "Vooraf krijgt u de eerste V6 Hairboost-<br />behandeling om de haarzakjes te versterken.<br />U bereidt zich vijf dagen voor zonder nicotine,<br />alcohol of bloedverdunners.",
        };
      case 'Treatment':
        return {
          quote: "Tijdens de behandeling worden gezonde<br />haarzakjes verplaatst naar de kalende zones.<br />De ingreep gebeurt onder lokale verdoving en<br />duurt gemiddeld 6 tot 8 uur.",
        };
      case 'After-':
        return {
          quote: "Na de transplantatie kunt u dezelfde dag naar<br />huis. Na 3 dagen rust hervat u lichte activiteiten<br />en na 1 week kunt u weer werken.",
        };
    }
  };

  // Get position percentage for timeline
  const getPhasePosition = (phase: Phase) => {
    switch (phase) {
      case 'Pre-':
        return 16.67;
      case 'Treatment':
        return 50;
      case 'After-':
        return 83.33;
    }
  };

  const getLineFillPercentage = () => {
    return getPhasePosition(activePhase);
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Tab Navigation Bar */}
      <div className="w-full flex justify-center pt-8 pb-6 px-4">
        <div className="flex gap-3 bg-background/10 backdrop-blur-md rounded-full p-2 border border-border/20">
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 ${
                activePhase === phase
                  ? 'bg-primary/20 text-foreground border border-primary/30 shadow-lg'
                  : 'text-foreground/60 hover:text-foreground/80 hover:bg-background/5'
              }`}
            >
              {phase}
            </button>
          ))}
        </div>
      </div>

      {/* Three-Column Description Grid */}
      <div className="w-full px-8 mb-8">
        <div className="grid grid-cols-3 gap-6 max-w-7xl mx-auto">
          {phases.map((phase) => {
            const isActive = activePhase === phase;
            const content = getPhaseContent(phase);
            
            return (
              <div
                key={phase}
                className={`flex flex-col items-center text-center transition-all duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-40 blur-sm'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-4 ${
                  isActive ? 'text-primary' : 'text-foreground/70'
                }`}>
                  {phase}
                </h3>
                <p
                  className={`text-base leading-relaxed ${
                    isActive ? 'text-foreground' : 'text-foreground/60'
                  }`}
                  dangerouslySetInnerHTML={{ __html: content.quote }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Section */}
      <div className="w-full flex justify-center px-8 mb-8">
        <div className="relative w-full max-w-md">
          <video
            key={isIOSorSafari ? 'mp4' : 'webm'}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded-2xl shadow-2xl"
          >
            {isIOSorSafari ? (
              <source src="/assets/head-rotation.mp4" type="video/mp4" />
            ) : (
              <source src="/assets/head-animation.webm" type="video/webm" />
            )}
          </video>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="w-full flex justify-center px-8 mb-16">
        <div className="relative w-full max-w-md">
          <div className="flex justify-between items-center relative">
            {/* Background line */}
            <div className="absolute left-0 right-0 h-0.5 bg-border/30 top-1/2 -translate-y-1/2" />
            
            {/* Animated fill line */}
            <div 
              className="absolute left-0 h-0.5 bg-primary top-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
              style={{ width: `${getLineFillPercentage()}%` }}
            />

            {/* Phase dots */}
            {phases.map((phase) => {
              const isActive = activePhase === phase;
              const position = getPhasePosition(phase);
              
              return (
                <div
                  key={phase}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                  style={{ left: `${position}%` }}
                >
                  <button
                    onClick={() => setActivePhase(phase)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-primary scale-125 shadow-lg shadow-primary/50'
                        : 'bg-border/50 hover:bg-border hover:scale-110'
                    }`}
                    aria-label={`Go to ${phase}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom-Right CTA Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => navigate(`/${language}/haartransplantatie/premium`)}
          className="px-8 py-4 bg-primary/90 backdrop-blur-md hover:bg-primary text-primary-foreground rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 text-lg font-medium border border-primary/20"
        >
          Bekijk onze methodes
        </button>
      </div>
    </div>
  );
};
