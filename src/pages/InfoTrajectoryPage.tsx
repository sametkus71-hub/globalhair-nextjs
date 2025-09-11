import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';
import { AnimatedTrajectoryBackground } from '@/components/trajectory/AnimatedTrajectoryBackground';

const InfoTrajectoryPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const handleBack = () => {
    setIsExiting(true);
    // Always go back to info page
    const infoPath = language === 'nl' ? '/nl/info' : '/en/info';
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      navigate(infoPath);
    }, 300);
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
        handleBack();
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
        mainTitle: 'De beste nazorg',
        description: 'Na de ingreep begeleiden we u stap voor stap in herstel en haargroei. We blijven betrokken tot de resultaten volledig zichtbaar en stabiel zijn.behandeling.'
      },
      {
        title: 'WE GROW\nWITH YOU', 
        subtitle: '300 gesprekken per maand.\n50 worden behandeld',
        mainTitle: 'Professionele behandeling',
        description: 'Ervaren specialisten voeren uw haartransplantatie uit met de nieuwste technieken voor optimale resultaten.'
      },
      {
        title: 'WE GROW\nWITH YOU',
        subtitle: '300 gesprekken per maand.\n50 worden behandeld', 
        mainTitle: 'Persoonlijke voorbereiding',
        description: 'Een uitgebreide consultatie en zorgvuldige voorbereiding vormen de basis van uw succesvolle behandeling.'
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
        mainTitle: 'The best aftercare',
        description: 'After the procedure, we guide you step by step through recovery and hair growth. We remain involved until results are fully visible and stable.'
      },
      {
        title: 'WE GROW\nWITH YOU',
        subtitle: '300 conversations per month.\n50 get treated', 
        mainTitle: 'Professional treatment',
        description: 'Experienced specialists perform your hair transplant using the latest techniques for optimal results.'
      },
      {
        title: 'WE GROW\nWITH YOU',
        subtitle: '300 conversations per month.\n50 get treated',
        mainTitle: 'Personal preparation', 
        description: 'An extensive consultation and careful preparation form the foundation of your successful treatment.'
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
      <MetaHead 
        title={language === 'nl' ? 'Traject' : 'Trajectory'}
        description={language === 'nl' ? 'Informatie over behandeltrajecten' : 'Information about treatment trajectories'}
        language={language}
      />
      <div className={`info-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'slide-exit-right' : 'slide-enter-left'}`}>
        {/* Animated Background */}
        <div className="min-h-[var(--app-height)] relative">
          <AnimatedTrajectoryBackground />
          
          {/* Back button */}
          <button
            onClick={handleBack}
            className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-gray-400/60 hover:bg-gray-400/80 transition-colors flex items-center justify-center"
            aria-label={language === 'nl' ? 'Terug' : 'Back'}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          {/* Scrollable Content */}
          <div className="pt-16 md:pt-20 pb-20 md:pb-32 px-6">
            <div className="max-w-2xl mx-auto min-h-[calc(var(--app-height)-8rem)] flex flex-col">
              
              {/* Static Title Section */}
              <div className={`text-center mb-12 transition-all duration-500 ease-out ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="mt-8 mb-12">
                  <h1 
                    className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-lato font-normal mb-6 leading-[0.9] tracking-tight whitespace-pre-line"
                    style={{ color: '#ACD1C6' }}
                  >
                    {trajectData.title}
                  </h1>
                  <p 
                    className="text-sm md:text-lg xl:text-xl font-lato font-normal leading-relaxed whitespace-pre-line"
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
                            <div className="w-56 h-56 md:w-72 md:h-72 bg-white/90 rounded-full shadow-lg flex items-center justify-center mb-16">
                            </div>
                            
                            {/* Middle Content */}
                            <div className="flex-1 flex flex-col justify-center">
                              <h2 
                                className="text-2xl md:text-3xl font-lato font-normal mb-6 tracking-wide text-white"
                              >
                                {slide.mainTitle}
                              </h2>
                              <p 
                                className="text-sm md:text-base font-lato leading-relaxed max-w-xs mx-auto text-white"
                              >
                                {slide.description}
                              </p>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </div>

              {/* Static Bottom Section */}
              <div className={`text-center mt-auto pt-8 transition-all duration-500 ease-out ${
                buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                {/* Navigation Dots */}
                <div className="flex justify-center space-x-3 mb-8">
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
      <BottomNavigationPortal />
    </>
  );
};

export default InfoTrajectoryPage;