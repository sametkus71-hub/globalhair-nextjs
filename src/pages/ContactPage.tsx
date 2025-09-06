import React, { useState, useEffect, useCallback } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react';

const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { handlePopupClose } = usePopupClose();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [countryVisible, setCountryVisible] = useState(false);
  const [iconsVisible, setIconsVisible] = useState(false);
  const [locationsVisible, setLocationsVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<'nederland' | 'turkije'>('nederland');
  const [activeGlobalIndex, setActiveGlobalIndex] = useState(0);
  const [locationCarouselApi, setLocationCarouselApi] = useState<CarouselApi>();
  const [iconCarouselApi, setIconCarouselApi] = useState<CarouselApi>();

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(200);
  };

  // Unified location data for endless carousel
  const allLocations = [
    {
      id: 'barendrecht',
      name: 'BARENDRECHT',
      subtitle: 'HOOFDKANTOOR',
      address: 'Pesetastraat 76, 2991 XT Barendrecht',
      phone: '085 750 0577',
      hours: 'Ma/di/wo/do/vr',
      province: 'Zuid-Holland',
      country: 'nederland' as const,
      icon: 'windmill'
    },
    {
      id: 'leiden',
      name: 'LEIDEN',
      subtitle: 'VESTIGING',
      address: 'Stationsweg 46, 2312 AV Leiden',
      phone: '071 514 1400',
      hours: 'Ma/di/wo/do/vr',
      province: 'Zuid-Holland',
      country: 'nederland' as const,
      icon: 'tulip'
    },
    {
      id: 'istanbul',
      name: 'ISTANBUL',
      subtitle: 'KLINIEK',
      address: 'Şişli Mahallesi, İstanbul, Turkey',
      phone: '+90 212 555 0123',
      hours: 'Pzt/Sal/Çar/Per/Cum',
      province: 'Istanbul',
      country: 'turkije' as const,
      icon: 'mosque'
    },
  ];

  // Auto-switch country based on active location
  useEffect(() => {
    const currentCountry = allLocations[activeGlobalIndex]?.country;
    if (currentCountry && currentCountry !== selectedCountry) {
      setSelectedCountry(currentCountry);
    }
  }, [activeGlobalIndex, selectedCountry]);

  // Sync both carousels
  const syncCarousels = useCallback((index: number) => {
    if (locationCarouselApi && iconCarouselApi) {
      locationCarouselApi.scrollTo(index);
      iconCarouselApi.scrollTo(index);
    }
  }, [locationCarouselApi, iconCarouselApi]);

  // Handle location carousel changes
  useEffect(() => {
    if (!locationCarouselApi) return;

    const onSelect = () => {
      const newIndex = locationCarouselApi.selectedScrollSnap();
      setActiveGlobalIndex(newIndex);
      if (iconCarouselApi) {
        iconCarouselApi.scrollTo(newIndex);
      }
    };

    locationCarouselApi.on('select', onSelect);
    return () => {
      locationCarouselApi.off('select', onSelect);
    };
  }, [locationCarouselApi, iconCarouselApi]);

  // Handle icon carousel changes
  useEffect(() => {
    if (!iconCarouselApi) return;

    const onSelect = () => {
      const newIndex = iconCarouselApi.selectedScrollSnap();
      setActiveGlobalIndex(newIndex);
      if (locationCarouselApi) {
        locationCarouselApi.scrollTo(newIndex);
      }
    };

    iconCarouselApi.on('select', onSelect);
    return () => {
      iconCarouselApi.off('select', onSelect);
    };
  }, [iconCarouselApi, locationCarouselApi]);

  // Get icon for location
  const getLocationIcon = (iconType: string, isActive: boolean, opacity: number = 1) => {
    const iconClass = `w-8 h-8 transition-all duration-300`;
    const style = { opacity };
    
    switch (iconType) {
      case 'windmill':
        return (
          <svg className={iconClass} style={style} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L8 8h8l-4-6zm0 20l4-6H8l4 6zm10-10l-6-4v8l6-4zM2 12l6 4V8l-6 4z"/>
          </svg>
        );
      case 'tulip':
        return (
          <svg className={iconClass} style={style} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2s2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 8c0-3.3 2.7-6 6-6s6 2.7 6 6c0 1.5-.6 2.8-1.5 3.8L12 22l-4.5-8.2C6.6 12.8 6 11.5 6 10z"/>
          </svg>
        );
      case 'mosque':
        return (
          <svg className={iconClass} style={style} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 1l-2 2v2l2-2 2 2V3l-2-2zm8 9c0-2-1-3-2-3s-2 1-2 3v1h4V10zM6 10c0-2-1-3-2-3S2 8 2 10v1h4v-1zm14 3H4v8h16v-8zm-8-1c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  // Staggered entrance animations
  useEffect(() => {
    const titleTimer = setTimeout(() => setTitleVisible(true), 200);
    const countryTimer = setTimeout(() => setCountryVisible(true), 400);
    const iconsTimer = setTimeout(() => setIconsVisible(true), 600);
    const locationsTimer = setTimeout(() => setLocationsVisible(true), 800);
    const contactTimer = setTimeout(() => setContactVisible(true), 1000);
    
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(countryTimer);
      clearTimeout(iconsTimer);
      clearTimeout(locationsTimer);
      clearTimeout(contactTimer);
    };
  }, []);

  return (
    <>
      <MetaHead 
        title={t('contact.page.title')}
        description={t('contact.page.description')}
        language={language}
      />
      <div className={`contact-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Background matching haartransplantatie page */}
        <div className="min-h-[var(--app-height)]" style={{ background: '#E4E5E0' }}>
          
          {/* Close button */}
          <PopupCloseButton onClose={handleClose} />
          
          {/* Scrollable Content */}
          <div className="pt-16 md:pt-20 pb-20 md:pb-32 px-6">
            <div className="max-w-4xl mx-auto min-h-[calc(var(--app-height)-8rem)] flex flex-col">
              
              {/* Title Section */}
              <div className={`text-center mb-8 transition-all duration-500 ease-out ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-700 mb-4 leading-tight tracking-tight">
                  MEET YOUR
                  <br />
                  FUTURE HAIRLINE
                </h1>
              </div>

              {/* Country Selection */}
              <div className={`flex justify-center mb-12 transition-all duration-500 ease-out relative ${
                countryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ zIndex: 9999 }}>
                <div 
                  className="rounded-md p-1 relative"
                  style={{
                    border: '1px solid',
                    borderImageSource: 'linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.6) 100%)',
                    background: 'rgba(228, 229, 224, 1)',
                    backdropFilter: 'blur(30px)',
                    boxShadow: '4px 3px 9.1px 4px rgba(0, 0, 0, 0.25) inset',
                    zIndex: 9999
                  }}
                >
                  <div className="flex relative gap-0.5" style={{ zIndex: 9999 }}>
                    {['nederland', 'turkije'].map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          const targetCountry = country as 'nederland' | 'turkije';
                          setSelectedCountry(targetCountry);
                          // Jump to first location of selected country
                          if (targetCountry === 'nederland') {
                            syncCarousels(0); // Barendrecht
                          } else {
                            syncCarousels(2); // Istanbul
                          }
                        }}
                        className={`px-4 py-1.5 rounded-sm font-lato text-[11px] sm:text-[12px] md:text-[13px] font-normal transition-all duration-200 relative touch-manipulation ${
                          selectedCountry === country
                            ? 'text-black'
                            : 'text-gray-600 hover:text-black'
                        }`}
                        style={{
                          zIndex: 9999,
                          ...(selectedCountry === country ? {
                            boxShadow: '3px 0px 8px 0px rgba(151, 151, 151, 0.8)',
                            backdropFilter: 'blur(52.3px)',
                            background: 'rgba(255, 255, 255, 0.95)'
                          } : {})
                        }}
                      >
                        {country === 'nederland' ? 'Nederland' : 'Turkije'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Icon Carousel Section */}
              <div className={`mt-16 mb-12 transition-all duration-500 ease-out ${
                iconsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <Carousel 
                  opts={{ 
                    align: 'center', 
                    loop: true,
                    dragFree: false,
                    containScroll: false,
                    skipSnaps: false,
                    duration: 25
                  }} 
                  className="w-full max-w-xs mx-auto"
                  setApi={setIconCarouselApi}
                >
                  <CarouselContent className="-ml-4">
                    {/* Create duplicates for seamless looping */}
                    {[...allLocations, ...allLocations, ...allLocations].map((location, index) => {
                      const actualIndex = index % allLocations.length;
                      const isActive = actualIndex === activeGlobalIndex;
                      const isPrevious = (activeGlobalIndex - 1 + allLocations.length) % allLocations.length === actualIndex;
                      const isNext = (activeGlobalIndex + 1) % allLocations.length === actualIndex;
                      
                      let opacity = 0.2;
                      let scale = 0.7;
                      
                      if (isActive) {
                        opacity = 1;
                        scale = 1;
                      } else if (isPrevious || isNext) {
                        opacity = 0.4;
                        scale = 0.8;
                      }
                      
                      return (
                        <CarouselItem key={`${location.id}-icon-${index}`} className="pl-4 basis-1/3">
                          <div className="flex justify-center">
                            <div 
                              className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 border-2 cursor-pointer ${
                                isActive 
                                  ? 'bg-gray-800 text-white border-gray-800' 
                                  : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                              }`}
                              style={{ 
                                opacity, 
                                transform: `scale(${scale})`,
                                filter: isActive ? 'none' : 'grayscale(0.3)'
                              }}
                              onClick={() => syncCarousels(actualIndex)}
                            >
                              {getLocationIcon(location.icon, isActive, 1)}
                            </div>
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                </Carousel>
              </div>

              {/* Endless Location Cards */}
              <div className={`transition-all duration-500 ease-out ${
                locationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <Carousel 
                  opts={{ 
                    align: 'center', 
                    loop: true,
                    dragFree: false,
                    containScroll: false,
                    skipSnaps: false,
                    duration: 25
                  }} 
                  className="w-full max-w-sm mx-auto"
                  setApi={setLocationCarouselApi}
                >
                  <CarouselContent className="-ml-4">
                    {allLocations.map((location, index) => (
                      <CarouselItem key={`${location.id}-location`} className="pl-4 basis-full">
                        <div className="text-center px-4 py-2">
                          {/* Location Title */}
                          <h3 className="text-xl font-black text-gray-700 mb-0 tracking-tight leading-tight">{location.name}</h3>
                          <p className="text-sm text-gray-500 font-normal mb-4 uppercase tracking-wider">{location.subtitle}</p>
                          
                          {/* Location Details */}
                          <div className="space-y-0 text-gray-600 leading-tight">
                            <div>
                              <p className="text-xs font-normal leading-tight">Adres: {location.address}</p>
                            </div>
                            <div>
                              <p className="text-xs font-normal leading-tight">Telefoon: {location.phone}</p>
                            </div>
                            <div>
                              <p className="text-xs font-normal leading-tight">Openingstijden: {location.hours}</p>
                            </div>
                            <div>
                              <p className="text-xs font-normal leading-tight">Provincie: {location.province}</p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  
                  {/* Pagination Dots */}
                  <div className="flex justify-center gap-2 mt-6">
                    {allLocations.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          index === activeGlobalIndex ? 'bg-gray-800' : 'bg-gray-400 hover:bg-gray-600'
                        }`}
                        onClick={() => syncCarousels(index)}
                      />
                    ))}
                  </div>
                </Carousel>
              </div>

              {/* Contact Icons Section */}
              <div className={`mt-auto pt-4 transition-all duration-500 ease-out ${
                contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="flex items-center justify-center gap-4">
                  {/* Email */}
                  <a 
                    href="mailto:info@hairexcellence.com"
                    className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-all duration-200"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4 text-white" />
                  </a>
                  
                  {/* Phone - Middle item (slightly bigger) */}
                  <a 
                    href="tel:0857500577"
                    className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-all duration-200"
                    aria-label="Phone"
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </a>
                  
                  {/* Instagram */}
                  <a 
                    href="https://instagram.com/hairexcellence"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;