import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';
import { AnimatedGradientBackground } from '@/components/method/AnimatedGradientBackground';
const InfoMethodPage: React.FC = () => {
  const {
    language
  } = useLanguage();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [accordionVisible, setAccordionVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const handleBack = () => {
    setIsExiting(true);
    // Always go back to info page
    const infoPath = language === 'nl' ? '/nl/info' : '/en/info';

    // Wait for animation to complete before navigating
    setTimeout(() => {
      navigate(infoPath);
    }, 300);
  };
  const handleTrajectoryClick = () => {
    // Store current path for back navigation
    sessionStorage.setItem('previousPath', window.location.pathname);
    const trajectoryPath = language === 'nl' ? '/nl/info/traject' : '/en/info/trajectory';
    navigate(trajectoryPath);
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
    const timer2 = setTimeout(() => setAccordionVisible(true), 300);
    const timer3 = setTimeout(() => setButtonVisible(true), 500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  const methodsData = language === 'nl' ? {
    title: 'SIGNATURE METHODES',
    subtitle: 'Haar | wenkbauwen | Baard',
    trajectoryButton: 'Bekijk het traject',
    methods: [{
      title: 'FUE safer & DHI- laall',
      content: 'Follicular Unit Extraction is een moderne methode waarbij individuele haarzakjes worden geëxtraheerd en getransplanteerd. Deze techniek zorgt voor natuurlijke resultaten met minimale littekens.'
    }, {
      title: 'Stamcel - lala',
      content: 'Stamceltherapie ter ondersteuning van haargezondheid en stimulatie van natuurlijke haargroei met regeneratieve eigenschappen.'
    }, {
      title: 'Comfort behandeling',
      content: 'Een comfortabele behandelervaring met minimale pijn en optimale zorg tijdens en na de procedure voor uw gemoedsrust.'
    }, {
      title: 'V6 Hairboost® - lalal',
      content: 'Onze exclusieve V6 Hairboost technologie voor verbeterde haargroei en optimale resultaten met geavanceerde methoden.'
    }, {
      title: 'GHI precision method™',
      content: 'Gepatenteerde precisie methode voor exacte plaatsing en natuurlijke resultaten met state-of-the-art technologie.'
    }, {
      title: '12-Point Precision Scan™',
      content: 'Geavanceerde 12-punts precisie scan voor optimale analyse en planning van uw haartransplantatie behandeling.'
    }]
  } : {
    title: 'MIGHTY METHOD',
    subtitle: 'Hair | eyebrows | Beard',
    trajectoryButton: 'view the trajectory',
    methods: [{
      title: 'FUE safer & DHI- laall',
      content: 'Follicular Unit Extraction is a modern method where individual hair follicles are extracted and transplanted. This technique ensures natural results with minimal scarring.'
    }, {
      title: 'Stamcel - lala',
      content: 'Stem cell therapy to support hair health and stimulate natural hair growth with regenerative properties.'
    }, {
      title: 'Comfort treatment',
      content: 'A comfortable treatment experience with minimal pain and optimal care during and after the procedure for your peace of mind.'
    }, {
      title: 'V6 Hairboost® - lalal',
      content: 'Our exclusive V6 Hairboost technology for enhanced hair growth and optimal results with advanced methods.'
    }, {
      title: 'GHI precision method™',
      content: 'Patented precision method for exact placement and natural results with state-of-the-art technology.'
    }, {
      title: '12-Point Precision Scan™',
      content: 'Advanced 12-point precision scan for optimal analysis and planning of your hair transplant treatment.'
    }]
  };
  return <>
      <MetaHead title={language === 'nl' ? 'Behandel Methode' : 'Treatment Method'} description={language === 'nl' ? 'Informatie over behandelmethoden' : 'Information about treatment methods'} language={language} />
      <div className={`info-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'slide-exit-right' : 'slide-enter-left'}`}>
        {/* Animated Background */}
        <div className="min-h-[var(--app-height)] relative">
          <AnimatedGradientBackground />
          
          {/* Scrollable Content */}
          <div className="pt-16 md:pt-20 pb-20 md:pb-32 px-6">
            <div className="max-w-2xl mx-auto min-h-[calc(var(--app-height)-8rem)] flex flex-col">
              
               {/* Title Section */}
              <div className={`text-center mb-8 md:mb-16 transition-all duration-500 ease-out ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h1 className="md:text-4xl lg:text-5xl xl:text-6xl font-lato text-[#ACD1C6] mb-3 md:mb-4 leading-[0.9] tracking-tight font-normal text-4xl">
                  {methodsData.title}
                </h1>
                <p className="text-base md:text-lg xl:text-xl text-[#ACD1C6]/80 font-lato font-normal tracking-wide">
                  {methodsData.subtitle}
                </p>
              </div>

              {/* Accordion Section */}
              <div className={`flex-1 mb-8 md:mb-16 transition-all duration-500 ease-out ${accordionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Accordion type="multiple" className="space-y-0">
                  {methodsData.methods.map((method, index) => <AccordionItem key={index} value={`item-${index}`} className="border-b border-[#ACD1C6]/30 last:border-b-0">
                      <AccordionTrigger className="py-3 md:py-5 px-0 hover:no-underline group">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-left text-base md:text-lg font-lato font-normal text-[#ACD1C6] group-hover:text-[#ACD1C6]/80">
                            {method.title}
                          </span>
                          <Plus className="w-4 md:w-5 h-4 md:h-5 text-[#ACD1C6] transition-transform duration-200 shrink-0 group-data-[state=open]:rotate-45" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 pb-3 md:pb-5">
                        <p className="text-sm md:text-base text-[#ACD1C6]/70 font-lato leading-relaxed">
                          {method.content}
                        </p>
                      </AccordionContent>
                    </AccordionItem>)}
                </Accordion>
              </div>

              {/* Bottom Button */}
              <div className={`text-center mt-auto pt-4 transition-all duration-500 ease-out ${buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <button onClick={handleTrajectoryClick} className="py-2 md:py-2.5 px-8 md:px-10 bg-[#492C3A] text-white text-sm font-lato font-normal rounded-full hover:bg-[#492C3A]/80 active:scale-[0.98] transition-all duration-300 ease-out">
                  {methodsData.trajectoryButton}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
      <BottomNavigationPortal />
    </>;
};
export default InfoMethodPage;