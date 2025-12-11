import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { AnimatedTrajectoryBackground } from '@/components/trajectory/AnimatedTrajectoryBackground';
import { PopupCloseButton } from '@/components/PopupCloseButton';
import { useViewportHeight } from '@/hooks/useViewportHeight';

const InfoTrajectoryPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { heightBreakpoint } = useViewportHeight();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  
  // Height-responsive classes
  const isSmallHeight = heightBreakpoint === 'small';

  const handleClose = () => {
    setIsExiting(true);
    // Navigate to haartransplantatie page
    const haartransplantatePath = language === 'nl' ? '/nl/haartransplantatie' : '/en/haartransplantatie';
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      navigate(haartransplantatePath);
    }, 350);
  };

  const handleMethodClick = () => {
    // Store current path for back navigation
    sessionStorage.setItem('previousPath', window.location.pathname);
    const methodPath = language === 'nl' ? '/nl/info/methode' : '/en/info/method';
    navigate(methodPath);
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Staggered entrance animations
  useEffect(() => {
    const timer1 = setTimeout(() => setTitleVisible(true), 100);
    const timer2 = setTimeout(() => setContentVisible(true), 300);
    const timer3 = setTimeout(() => setButtonVisible(true), 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const trajectData = language === 'nl' ? {
    title: 'WE GROW\nWITH YOU',
    subtitle: '300 gesprekken per maand.\n50 worden behandeld',
    methodButton: 'Bekijk methodes',
    slides: [
      {
        title: 'WE GROW\nWITH YOU',
        subtitle: '300 gesprekken per maand.\n50 worden behandeld',
        mainTitle: 'Voorbehandeling',
        description: 'Je traject start met een uitgebreide intake en onze 12-Point Precision Scan™. Zo krijgen we een compleet beeld van je hoofdhuid, haarzakjes en herstelmogelijkheden.',
        slogan: 'We kijken niet alleen naar je haar. We kijken vooruit.'
      },
      {
        title: 'WE GROW\nWITH YOU', 
        subtitle: '300 gesprekken per maand.\n50 worden behandeld',
        mainTitle: 'Behandeling',
        description: 'Je transplantatie wordt uitgevoerd met uiterste zorg en precisie, door een team van specialisten. We gebruiken de beste technieken én stemmen alles af op jouw unieke situatie.',
        slogan: 'Geen standaardaanpak. Wel standaard het beste.'
      },
      {
        title: 'WE GROW\nWITH YOU',
        subtitle: '300 gesprekken per maand.\n50 worden behandeld', 
        mainTitle: 'Nazorg',
        description: 'Na de behandeling laten we je niet los. We begeleiden je in elke stap van je herstel en haargroei, tot 12 maanden na de ingreep.',
        slogan: 'Want echte resultaten hebben tijd én aandacht nodig.'
      }
    ]
  } : {
    title: 'WE GROW\nWITH YOU',
    subtitle: '300 conversations per month.\n50 get treated',
    methodButton: 'View methods',
    slides: [
      {
        title: 'WE GROW\nWITH YOU',
        subtitle: '300 conversations per month.\n50 get treated',
        mainTitle: 'Pre-treatment',
        description: "Your journey starts with an extensive intake and our 12-Point Precision Scan™. This way we get a complete picture of your scalp, hair follicles and recovery possibilities.",
        slogan: "We don't just look at your hair. We look ahead."
      },
      {
        title: 'WE GROW\nWITH YOU',
        subtitle: '300 conversations per month.\n50 get treated', 
        mainTitle: 'Treatment',
        description: 'Your transplant is performed with utmost care and precision, by a team of specialists. We use the best techniques and tailor everything to your unique situation.',
        slogan: 'No standard approach. Always the standard best.'
      },
      {
        title: 'WE GROW\nWITH YOU',
        subtitle: '300 conversations per month.\n50 get treated',
        mainTitle: 'Aftercare', 
        description: "After treatment, we don't let you go. We guide you through every step of your recovery and hair growth, up to 12 months after the procedure.",
        slogan: 'Real results need time and attention.'
      }
    ]
  };

  // Carousel functionality
  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <>
      <SEOHead 
        title={language === 'nl' ? 'Het Traject' : 'The Trajectory'}
        description={language === 'nl' ? 'Ontdek wat u kunt verwachten tijdens uw haartransplantatie traject bij GlobalHair Institute.' : 'Discover what to expect during your hair transplant journey at GlobalHair Institute.'}
      />
      {/* Fixed Background - Outside page container */}
      <AnimatedTrajectoryBackground />
      
      <div className={`info-trajectory-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'info-trajectory-page-exit' : ''}`}>
        <div className="min-h-[var(--app-height)] relative">
          {/* Close Button */}
          <PopupCloseButton onClose={handleClose} />
          
          {/* Scrollable Content */}
          <div className={`${isSmallHeight ? 'pt-4' : 'pt-8'} md:pt-12 pb-20 md:pb-24 px-6 relative z-10`}>
            <div className="max-w-2xl mx-auto min-h-[calc(var(--app-height)-8rem)] flex flex-col">
              
              {/* Static Title Section */}
              <div className={`text-center ${isSmallHeight ? 'mb-4' : 'mb-8'} transition-all duration-500 ease-out ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="mt-4 mb-8">
                  <h1 
                    className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-lato font-normal mb-6 leading-[0.9] tracking-tight whitespace-pre-line"
                    style={{ color: '#ACD1C6' }}
                  >
                    {trajectData.title}
                  </h1>
                  <p 
                    className="text-sm md:text-lg xl:text-xl font-lato font-normal leading-tight whitespace-pre-line"
                    style={{ color: '#ACD1C6' }}
                  >
                    {trajectData.subtitle}
                  </p>
                </div>
              </div>

              {/* Carousel Container - Only middle content */}
              <div className="flex justify-center flex-1">
                <div className="w-full max-w-sm">
                  <Carousel 
                    setApi={setApi}
                    className="w-full h-full"
                    plugins={[
                      Autoplay({
                        delay: 8000,
                      }),
                    ]}
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent className="h-full">
                      {trajectData.slides.map((slide, index) => (
                        <CarouselItem key={index} className="h-full">
                          <div className={`flex flex-col items-center text-center h-full px-6 transition-all duration-500 ease-out ${
                            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                          }`}>
                            {/* Large White Circle */}
                            <div className={`${isSmallHeight ? 'w-32 h-32' : 'w-40 h-40'} md:w-48 md:h-48 bg-white/90 rounded-full shadow-lg flex items-center justify-center ${isSmallHeight ? 'mb-4' : 'mb-8'}`}>
                            </div>
                            
                            {/* Middle Content */}
                            <div className="flex-1 flex flex-col justify-center">
                              <h2 
                                className="text-lg md:text-xl font-lato font-normal mb-2 tracking-wide text-white"
                              >
                                {slide.mainTitle}
                              </h2>
                              <p 
                                className="text-xs md:text-sm font-lato leading-relaxed max-w-xs mx-auto text-white mb-4"
                              >
                                {slide.description}
                              </p>
                              {slide.slogan && (
                                <p 
                                  className="text-xs md:text-sm font-lato leading-relaxed max-w-xs mx-auto text-white italic"
                                >
                                  {slide.slogan}
                                </p>
                              )}
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </div>

              {/* Static Bottom Section */}
              <div className={`text-center mt-auto ${isSmallHeight ? 'pt-4' : 'pt-8'} pb-6 transition-all duration-500 ease-out ${
                buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                {/* Navigation Dots */}
                <div className={`flex justify-center space-x-3 ${isSmallHeight ? 'mb-4' : 'mb-8'}`}>
                  {trajectData.slides.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={() => scrollTo(dotIndex)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        dotIndex === current 
                          ? 'bg-white scale-110' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    />
                  ))}
                </div>

                {/* Bottom Button */}
                <button
                  onClick={handleMethodClick}
                  className="py-2 md:py-2.5 px-8 md:px-10 bg-[#492C3A] text-white text-sm font-lato font-normal rounded-full hover:bg-[#492C3A]/80 active:scale-[0.98] transition-all duration-300 ease-out"
                >
                  {trajectData.methodButton}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoTrajectoryPage;