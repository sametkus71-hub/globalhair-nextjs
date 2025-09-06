import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const InfoMethodPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [accordionVisible, setAccordionVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  const handleBack = () => {
    setIsExiting(true);
    // Get previous path or default to info
    const previousPath = sessionStorage.getItem('previousPath') || 
                        (language === 'nl' ? '/nl/info' : '/en/info');
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      sessionStorage.removeItem('previousPath');
      navigate(previousPath);
    }, 300);
  };

  const handleTrajectoryClick = () => {
    // Store current path for back navigation
    sessionStorage.setItem('previousPath', window.location.pathname);
    const trajectoryPath = language === 'nl' ? '/nl/info/trajectory' : '/en/info/trajectory';
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
    title: 'MIGHTY METHOD',
    subtitle: 'Haar | wenkbauwen | Baard',
    trajectoryButton: 'bekijk het traject',
    methods: [
      {
        title: 'FUE safer & DHI- laall',
        content: 'Follicular Unit Extraction is een moderne methode waarbij individuele haarzakjes worden geëxtraheerd en getransplanteerd. Deze techniek zorgt voor natuurlijke resultaten met minimale littekens.'
      },
      {
        title: 'Stamcel - lala',
        content: 'Stamceltherapie ter ondersteuning van haargezondheid en stimulatie van natuurlijke haargroei met regeneratieve eigenschappen.'
      },
      {
        title: 'Comfort behandeling',
        content: 'Een comfortabele behandelervaring met minimale pijn en optimale zorg tijdens en na de procedure voor uw gemoedsrust.'
      },
      {
        title: 'V6 Hairboost® - lalal',
        content: 'Onze exclusieve V6 Hairboost technologie voor verbeterde haargroei en optimale resultaten met geavanceerde methoden.'
      },
      {
        title: 'GHI precision method™',
        content: 'Gepatenteerde precisie methode voor exacte plaatsing en natuurlijke resultaten met state-of-the-art technologie.'
      },
      {
        title: '12-Point Precision Scan™',
        content: 'Geavanceerde 12-punts precisie scan voor optimale analyse en planning van uw haartransplantatie behandeling.'
      }
    ]
  } : {
    title: 'MIGHTY METHOD',
    subtitle: 'Hair | eyebrows | Beard',
    trajectoryButton: 'view the trajectory',
    methods: [
      {
        title: 'FUE safer & DHI- laall',
        content: 'Follicular Unit Extraction is a modern method where individual hair follicles are extracted and transplanted. This technique ensures natural results with minimal scarring.'
      },
      {
        title: 'Stamcel - lala',
        content: 'Stem cell therapy to support hair health and stimulate natural hair growth with regenerative properties.'
      },
      {
        title: 'Comfort treatment',
        content: 'A comfortable treatment experience with minimal pain and optimal care during and after the procedure for your peace of mind.'
      },
      {
        title: 'V6 Hairboost® - lalal',
        content: 'Our exclusive V6 Hairboost technology for enhanced hair growth and optimal results with advanced methods.'
      },
      {
        title: 'GHI precision method™',
        content: 'Patented precision method for exact placement and natural results with state-of-the-art technology.'
      },
      {
        title: '12-Point Precision Scan™',
        content: 'Advanced 12-point precision scan for optimal analysis and planning of your hair transplant treatment.'
      }
    ]
  };

  return (
    <>
      <MetaHead 
        title={language === 'nl' ? 'Behandel Methode' : 'Treatment Method'}
        description={language === 'nl' ? 'Informatie over behandelmethoden' : 'Information about treatment methods'}
        language={language}
      />
      <div className={`info-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'slide-exit-right' : 'slide-enter-left'}`}>
        {/* Background matching parent */}
        <div className="min-h-[var(--app-height)]" style={{ background: '#E4E5E0' }}>
          
          {/* Back button */}
          <button
            onClick={handleBack}
            className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-gray-400/60 hover:bg-gray-400/80 transition-colors flex items-center justify-center"
            aria-label={language === 'nl' ? 'Terug' : 'Back'}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          {/* Scrollable Content */}
          <div className="pt-20 pb-32 px-6">
            <div className="max-w-2xl mx-auto">
              
              {/* Title Section */}
              <div className={`text-center mb-16 transition-all duration-500 ease-out ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-700 mb-8 leading-[0.9] tracking-tight">
                  {methodsData.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 font-normal tracking-wide">
                  {methodsData.subtitle}
                </p>
              </div>

              {/* Accordion Section */}
              <div className={`mb-20 transition-all duration-500 ease-out ${
                accordionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <Accordion type="multiple" className="space-y-0">
                  {methodsData.methods.map((method, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-b border-gray-400/30 last:border-b-0"
                    >
                      <AccordionTrigger className="py-6 px-0 hover:no-underline group [&[data-state=open]>div>svg]:rotate-45">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-left text-lg font-normal text-gray-600 group-hover:text-gray-800">
                            {method.title}
                          </span>
                          <Plus className="w-5 h-5 text-gray-600 transition-transform duration-200 shrink-0" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 pb-6">
                        <p className="text-gray-600 leading-relaxed">
                          {method.content}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Bottom Button */}
              <div className={`text-center transition-all duration-500 ease-out ${
                buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <button
                  onClick={handleTrajectoryClick}
                  className="py-3 px-8 bg-gray-600 text-white text-sm font-normal rounded-full hover:bg-gray-700 active:scale-[0.98] transition-all duration-300 ease-out"
                >
                  {methodsData.trajectoryButton}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoMethodPage;