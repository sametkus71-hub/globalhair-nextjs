import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';
import { AnimatedGradientBackground } from '@/components/method/AnimatedGradientBackground';
import { PopupCloseButton } from '@/components/PopupCloseButton';
const InfoMethodPage: React.FC = () => {
  const {
    language
  } = useLanguage();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [accordionVisible, setAccordionVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const handleClose = () => {
    setIsExiting(true);
    // Always go back to info page
    const infoPath = language === 'nl' ? '/nl/info' : '/en/info';

    // Wait for animation to complete before navigating
    setTimeout(() => {
      navigate(infoPath);
    }, 350);
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
      title: 'FUE safer & DHI',
      content: 'Onze haartransplantaties worden uitgevoerd met moderne extractietechnieken zoals FUE en DHI. Hierbij worden individuele haarzakjes nauwkeurig verplaatst voor een natuurlijk resultaat, met minimale littekens.',
      tagline: 'Meer haar. Minder zichtbare sporen.'
    }, {
      title: 'Stamceltherapie',
      content: 'We ondersteunen je haargroei met regeneratieve stamceltherapie. Deze methode stimuleert de natuurlijke herstelkracht van je haar, voor zichtbaar gezondere haarzakjes en nieuwe groei.',
      tagline: 'Activeren wat er al in je zit.'
    }, {
      title: 'Comfort behandeling',
      content: 'Een behandeling mag geen stressmoment zijn. Daarom zorgen we voor maximaal comfort, minimale pijn en volledige begeleiding tijdens én na je ingreep.',
      tagline: 'Zorg die je voelt – maar dan in de goede zin.'
    }, {
      title: 'V6 Hairboost®',
      content: 'Onze exclusieve V6 Hairboost® technologie versnelt je herstel en stimuleert extra haargroei, zowel voor als na transplantatie. Ontwikkeld in ons eigen lab voor het beste resultaat.',
      tagline: 'Je haar, een stap voor op zichzelf.'
    }, {
      title: 'GHI Precision Method™',
      content: 'Onze gepatenteerde methode voor maximale precisie. Door technologie en ervaring te combineren, zorgen we voor exact de juiste plaatsing – voor natuurlijk ogende, blijvende resultaten.',
      tagline: 'Omdat elk haar telt.'
    }, {
      title: '12-Point Precision Scan™',
      content: 'Elke behandeling start met inzicht. Onze geavanceerde scan brengt je hoofdhuid, haarzakjes en herstelpotentieel in kaart. Zo weten we precies wat kan – en wat werkt.',
      tagline: 'We kijken niet alleen naar je haar. We kijken vooruit.'
    }]
  } : {
    title: 'MIGHTY METHOD',
    subtitle: 'Hair | eyebrows | Beard',
    trajectoryButton: 'view the trajectory',
    methods: [{
      title: 'FUE safer & DHI',
      content: 'Our hair transplants are performed with modern extraction techniques such as FUE and DHI. Individual hair follicles are precisely moved for a natural result with minimal scarring.',
      tagline: 'More hair. Less visible traces.'
    }, {
      title: 'Stem cell therapy',
      content: 'We support your hair growth with regenerative stem cell therapy. This method stimulates the natural healing power of your hair for visibly healthier follicles and new growth.',
      tagline: 'Activating what is already within you.'
    }, {
      title: 'Comfort treatment',
      content: 'A treatment should not be a stressful moment. That is why we provide maximum comfort, minimal pain and complete guidance during and after your procedure.',
      tagline: 'Care you feel – but in the good way.'
    }, {
      title: 'V6 Hairboost®',
      content: 'Our exclusive V6 Hairboost® technology accelerates your recovery and stimulates extra hair growth, both before and after transplantation. Developed in our own lab for the best results.',
      tagline: 'Your hair, one step ahead of itself.'
    }, {
      title: 'GHI Precision Method™',
      content: 'Our patented method for maximum precision. By combining technology and experience, we ensure exactly the right placement – for natural-looking, lasting results.',
      tagline: 'Because every hair counts.'
    }, {
      title: '12-Point Precision Scan™',
      content: 'Every treatment starts with insight. Our advanced scan maps your scalp, hair follicles and recovery potential. This way we know exactly what is possible – and what works.',
      tagline: 'We do not just look at your hair. We look ahead.'
    }]
  };
  return <>
      <MetaHead title={language === 'nl' ? 'Behandel Methode' : 'Treatment Method'} description={language === 'nl' ? 'Informatie over behandelmethoden' : 'Information about treatment methods'} language={language} />
      {/* Fixed Background - Outside page container */}
      <AnimatedGradientBackground />
      
      <div className={`info-method-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'info-method-page-exit' : ''}`}>
        <div className="min-h-[var(--app-height)] relative">
          {/* Close Button */}
          <PopupCloseButton onClose={handleClose} isBackButton={true} />
          
          {/* Scrollable Content */}
          <div className="pt-16 md:pt-20 pb-20 md:pb-24 px-6 relative z-10">
            <div className="max-w-2xl mx-auto min-h-[calc(var(--app-height)-8rem)] flex flex-col">
              
               {/* Title Section */}
              <div className={`text-center mb-8 md:mb-16 transition-all duration-500 ease-out ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h1 className="md:text-4xl lg:text-5xl xl:text-6xl font-lato text-[#ACD1C6] mb-3 md:mb-4 leading-[0.9] tracking-tight font-normal text-4xl">
                  {methodsData.title}
                </h1>
                <p className="md:text-lg xl:text-xl text-[#ACD1C6]/80 font-lato tracking-wide font-normal text-sm">
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
                        <div className="mt-4">
                          <p className="text-sm md:text-base text-[#ACD1C6]/80 font-lato italic font-extralight">
                            {method.tagline}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>)}
                </Accordion>
              </div>

              {/* Bottom Button */}
              <div className={`text-center mt-auto pt-4 pb-6 transition-all duration-500 ease-out ${buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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