import React, { useState, useEffect } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';
import { AnimatedContactBackground } from '@/components/contact/AnimatedContactBackground';
import { AnimatedTurkeySvg } from '@/components/contact/AnimatedTurkeySvg';
import { PopupCloseButton } from '@/components/PopupCloseButton';
import { Mail, MessageCircle, Instagram, Plus } from 'lucide-react';

const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const { activeRoute } = useSession();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [toggleVisible, setToggleVisible] = useState(false);
  const [accordionVisible, setAccordionVisible] = useState(false);
  const [iconsVisible, setIconsVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<'nederland' | 'turkije'>('nederland');

  // Get the target path for the active route
  const getActiveRoutePath = () => {
    if (activeRoute === 'haartransplantatie') {
      return language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
    }
    if (activeRoute === 'v6-hairboost') {
      return `/${language}/v6-hairboost`;
    }
    // Default fallback to haartransplantatie
    return language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(getActiveRoutePath());
    }, 350);
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
    const timer2 = setTimeout(() => setToggleVisible(true), 300);
    const timer3 = setTimeout(() => setAccordionVisible(true), 500);
    const timer4 = setTimeout(() => setIconsVisible(true), 700);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const contactData = language === 'nl' ? {
    title: 'WHERE TO FIND US',
    countryButtons: {
      nederland: 'Nederland',
      turkije: 'Turkije'
    },
    locations: {
      nederland: [
        {
          name: 'Barendrecht',
          address: 'Pesetastraat 76\n2991 XT Barendrecht',
          phone: '085 750 0577',
          hours: 'Ma 10:00 - 19:00\ndi 10:00 - 19:00\nwo 10:00 - 19:00\ndo 10:00 - 19:00\nvr 10:00 - 19:00\nza 10:00 - 19:00\nzo Gesloten'
        },
        {
          name: 'Leiden',
          address: 'Fruitweg 22\n2321 GK Leiden',
          phone: '085 750 0577',
          hours: 'Ma 10:00 - 19:00\ndi 10:00 - 19:00\nwo 10:00 - 19:00\ndo 10:00 - 19:00\nvr 10:00 - 19:00\nza 10:00 - 19:00\nzo Gesloten'
        }
      ],
      turkije: [
        {
          name: 'Istanbul',
          address: 'Kaynarca mh. Erol Kaya cd.\nNo:204 34890\nPendik, Istanbul Turkije',
          phone: '085 750 0577',
          hours: 'Ma 10:00 - 19:00\ndi 10:00 - 19:00\nwo 10:00 - 19:00\ndo 10:00 - 19:00\nvr 10:00 - 19:00\nza 10:00 - 19:00\nzo Gesloten'
        }
      ]
    }
  } : {
    title: 'WHERE TO FIND US',
    countryButtons: {
      nederland: 'Netherlands',
      turkije: 'Turkey'
    },
    locations: {
      nederland: [
        {
          name: 'Barendrecht',
          address: 'Pesetastraat 76\n2991 XT Barendrecht',
          phone: '085 750 0577',
          hours: 'Mon 10:00 - 19:00\nTue 10:00 - 19:00\nWed 10:00 - 19:00\nThu 10:00 - 19:00\nFri 10:00 - 19:00\nSat 10:00 - 19:00\nSun Closed'
        },
        {
          name: 'Leiden',
          address: 'Fruitweg 22\n2321 GK Leiden',
          phone: '085 750 0577',
          hours: 'Mon 10:00 - 19:00\nTue 10:00 - 19:00\nWed 10:00 - 19:00\nThu 10:00 - 19:00\nFri 10:00 - 19:00\nSat 10:00 - 19:00\nSun Closed'
        }
      ],
      turkije: [
        {
          name: 'Istanbul',
          address: 'Kaynarca mh. Erol Kaya cd.\nNo:204 34890\nPendik, Istanbul Turkey',
          phone: '085 750 0577',
          hours: 'Mon 10:00 - 19:00\nTue 10:00 - 19:00\nWed 10:00 - 19:00\nThu 10:00 - 19:00\nFri 10:00 - 19:00\nSat 10:00 - 19:00\nSun Closed'
        }
      ]
    }
  };

  const currentLocations = contactData.locations[selectedCountry];

  return (
    <>
      <MetaHead 
        title={language === 'nl' ? 'Contact' : 'Contact'}
        description={language === 'nl' ? 'Neem contact met ons op' : 'Get in touch with us'}
        language={language}
      />
      {/* Fixed Background - Outside page container */}
      <AnimatedContactBackground />
      
      <div className={`info-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        <div className="min-h-[var(--app-height)] relative">
          {/* Close Button */}
          <PopupCloseButton onClose={handleClose} />
          
          {/* Scrollable Content */}
          <div className="pt-16 md:pt-20 pb-20 md:pb-32 px-6 relative z-10">
            <div className="max-w-2xl mx-auto min-h-[calc(var(--app-height)-8rem)] flex flex-col">
              
              {/* Title Section */}
              <div className={`text-center mb-8 md:mb-16 transition-all duration-500 ease-out ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h1 className="md:text-4xl lg:text-5xl xl:text-6xl font-lato text-[#ACD1C6] mb-3 md:mb-4 leading-[0.9] tracking-tight font-normal text-4xl" style={{textShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'}}>
                  WHERE TO<br />FIND US
                </h1>
              </div>

              {/* Country Toggle Buttons */}
              <div className={`flex justify-center mb-8 md:mb-12 transition-all duration-500 ease-out ${toggleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div 
                  className="inline-flex p-1 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                  }}
                >
                  <button
                    onClick={() => setSelectedCountry('nederland')}
                    className={`px-6 py-2 ${selectedCountry === 'nederland' ? 'rounded-sm' : 'rounded-lg'} font-lato text-sm font-medium transition-all duration-300 ease-out ${
                      selectedCountry === 'nederland'
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                    style={selectedCountry === 'nederland' ? {
                      backdropFilter: 'blur(40px)',
                      background: 'rgba(255, 255, 255, 0.3)'
                    } : {}}
                  >
                    {contactData.countryButtons.nederland}
                  </button>
                  <button
                    onClick={() => setSelectedCountry('turkije')}
                    className={`px-6 py-2 ${selectedCountry === 'turkije' ? 'rounded-sm' : 'rounded-lg'} font-lato text-sm font-medium transition-all duration-300 ease-out ${
                      selectedCountry === 'turkije'
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                    style={selectedCountry === 'turkije' ? {
                      backdropFilter: 'blur(40px)',
                      background: 'rgba(255, 255, 255, 0.3)'
                    } : {}}
                  >
                    {contactData.countryButtons.turkije}
                  </button>
                </div>
              </div>

              {/* Turkey SVG - Only visible when Turkey is selected */}
              {selectedCountry === 'turkije' && (
                <AnimatedTurkeySvg isVisible={toggleVisible} />
              )}

              {/* Accordion Section */}
              <div className={`flex-1 mb-8 md:mb-16 transition-all duration-500 ease-out ${accordionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Accordion type="multiple" className="space-y-0">
                  {currentLocations.map((location, index) => (
                    <AccordionItem key={`${selectedCountry}-${index}`} value={`item-${selectedCountry}-${index}`} className="border-b border-[#ACD1C6]/30 last:border-b-0">
                      <AccordionTrigger className="py-3 md:py-5 px-0 hover:no-underline group">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-left text-base md:text-lg font-lato font-normal text-[#ACD1C6] group-hover:text-[#ACD1C6]/80" style={{textShadow: '0 1px 4px rgba(0, 0, 0, 0.25)'}}>
                            {location.name}
                          </span>
                          <Plus className="w-4 md:w-5 h-4 md:h-5 text-[#ACD1C6] transition-transform duration-200 shrink-0 group-data-[state=open]:rotate-45" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 pb-3 md:pb-5">
                        <div className="space-y-3">
                          <div>
                            <a 
                              href={`https://maps.google.com/?q=${encodeURIComponent(location.address.replace(/\n/g, ' '))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm md:text-base text-[#ACD1C6]/70 font-lato leading-relaxed whitespace-pre-line hover:text-[#ACD1C6] transition-colors duration-200 border-b border-dotted border-[#ACD1C6]/30 hover:border-[#ACD1C6]/60 cursor-pointer block"
                            >
                              {location.address}
                            </a>
                          </div>
                          <div>
                            <a 
                              href={`tel:${location.phone.replace(/\s/g, '')}`}
                              className="text-sm md:text-base text-[#ACD1C6]/70 font-lato leading-relaxed hover:text-[#ACD1C6] transition-colors duration-200 border-b border-dotted border-[#ACD1C6]/30 hover:border-[#ACD1C6]/60 cursor-pointer inline-block"
                            >
                              {location.phone}
                            </a>
                          </div>
                          <div>
                            <p className="text-xs md:text-sm text-[#ACD1C6]/60 font-lato leading-relaxed whitespace-pre-line">
                              Openingstijden:
                            </p>
                            <p className="text-xs md:text-sm text-[#ACD1C6]/60 font-lato leading-relaxed whitespace-pre-line">
                              {location.hours}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Social Media Icons */}
              <div className={`text-center mt-auto pt-4 pb-16 md:pb-20 transition-all duration-500 ease-out ${iconsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="flex justify-center items-center space-x-3">
                  <button className="w-10 h-10 rounded-full bg-[#492C3A] flex items-center justify-center hover:bg-[#492C3A]/80 active:scale-[0.98] transition-all duration-300 ease-out">
                    <Mail className="w-4 h-4 text-white" />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-[#492C3A] flex items-center justify-center hover:bg-[#492C3A]/80 active:scale-[0.98] transition-all duration-300 ease-out">
                    <img 
                      src="/lovable-uploads/ab33be36-7b2a-41af-b438-bdb3de43ec5d.png" 
                      alt="WhatsApp" 
                      className="w-5 h-5"
                    />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-[#492C3A] flex items-center justify-center hover:bg-[#492C3A]/80 active:scale-[0.98] transition-all duration-300 ease-out">
                    <Instagram className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <BottomNavigationPortal />
    </>
  );
};

export default ContactPage;