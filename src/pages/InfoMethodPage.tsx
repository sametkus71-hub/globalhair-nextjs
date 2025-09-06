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
    subtitle: 'Onze bewezen behandelmethoden',
    trajectoryButton: 'Behandel traject',
    methods: [
      {
        title: 'FUE Haartransplantatie',
        content: 'Follicular Unit Extraction is een moderne methode waarbij individuele haarzakjes worden geëxtraheerd en getransplanteerd. Deze techniek zorgt voor natuurlijke resultaten met minimale littekens.'
      },
      {
        title: 'DHI Technique',
        content: 'Direct Hair Implantation gebruikt een speciale pen voor directe implantatie van haarzakjes. Dit zorgt voor meer precisie en snellere genezing.'
      },
      {
        title: 'Sapphire FUE',
        content: 'Een geavanceerde versie van FUE waarbij saffierblaadjes worden gebruikt voor nog preciezere en minder traumatische incisies.'
      },
      {
        title: 'Beard Transplantation',
        content: 'Gespecialiseerde techniek voor baard- en snortransplantaties met natuurlijke groeipatronen en optimale dichtheid.'
      },
      {
        title: 'Eyebrow Restoration',
        content: 'Delicate techniek voor wenkbrauwtransplantaties met aandacht voor natuurlijke vorm en groeirichting.'
      },
      {
        title: 'PRP Therapy',
        content: 'Platelet Rich Plasma therapie ter ondersteuning van haargezondheid en stimulatie van natuurlijke haargroei.'
      }
    ]
  } : {
    title: 'MIGHTY METHOD',
    subtitle: 'Our proven treatment methods',
    trajectoryButton: 'Treatment trajectory',
    methods: [
      {
        title: 'FUE Hair Transplant',
        content: 'Follicular Unit Extraction is a modern method where individual hair follicles are extracted and transplanted. This technique ensures natural results with minimal scarring.'
      },
      {
        title: 'DHI Technique',
        content: 'Direct Hair Implantation uses a special pen for direct implantation of hair follicles. This provides more precision and faster healing.'
      },
      {
        title: 'Sapphire FUE',
        content: 'An advanced version of FUE using sapphire blades for even more precise and less traumatic incisions.'
      },
      {
        title: 'Beard Transplantation',
        content: 'Specialized technique for beard and mustache transplants with natural growth patterns and optimal density.'
      },
      {
        title: 'Eyebrow Restoration',
        content: 'Delicate technique for eyebrow transplants with attention to natural shape and growth direction.'
      },
      {
        title: 'PRP Therapy',
        content: 'Platelet Rich Plasma therapy to support hair health and stimulate natural hair growth.'
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
              <div className={`text-center mb-12 transition-all duration-500 ease-out ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-700 mb-6 leading-[0.9] tracking-tight">
                  {methodsData.title}
                </h1>
                <p className="text-base md:text-lg text-gray-500 font-normal">
                  {methodsData.subtitle}
                </p>
              </div>

              {/* Accordion Section */}
              <div className={`mb-12 transition-all duration-500 ease-out ${
                accordionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <Accordion type="multiple" className="space-y-4">
                  {methodsData.methods.map((method, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border border-gray-300/50 rounded-2xl bg-white/30 backdrop-blur-sm overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-5 hover:no-underline group [&[data-state=open]>div>svg]:rotate-45">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-left text-lg font-medium text-gray-800 group-hover:text-gray-900">
                            {method.title}
                          </span>
                          <Plus className="w-5 h-5 text-gray-600 transition-transform duration-200 shrink-0" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-5">
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
                  className="w-full max-w-sm py-4 px-8 bg-gray-900 text-white text-base font-medium rounded-full hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out"
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