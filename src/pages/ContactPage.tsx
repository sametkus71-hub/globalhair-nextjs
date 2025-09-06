import React, { useState, useEffect } from 'react';
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
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(200);
  };

  // Reset active location index when country changes
  useEffect(() => {
    setActiveLocationIndex(0);
  }, [selectedCountry]);

  // Location data
  const locationData = {
    nederland: [
      {
        id: 'barendrecht',
        name: 'BARENDRECHT',
        subtitle: 'HOOFDKANTOOR',
        address: 'Pesetastraat 76, 2991 XT Barendrecht',
        phone: '085 750 0577',
        hours: 'Ma/di/wo/do/vr',
        province: 'Zuid-Holland',
      },
      {
        id: 'leiden',
        name: 'LEIDEN',
        subtitle: 'VESTIGING',
        address: 'Stationsweg 46, 2312 AV Leiden',
        phone: '071 514 1400',
        hours: 'Ma/di/wo/do/vr',
        province: 'Zuid-Holland',
      },
    ],
    turkije: [
      {
        id: 'istanbul',
        name: 'ISTANBUL',
        subtitle: 'KLINIEK',
        address: 'Şişli Mahallesi, İstanbul, Turkey',
        phone: '+90 212 555 0123',
        hours: 'Pzt/Sal/Çar/Per/Cum',
        province: 'Istanbul',
      },
    ],
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
                  className="rounded-md p-1.5 relative"
                  style={{
                    border: '1px solid',
                    borderImageSource: 'linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.6) 100%)',
                    background: 'rgba(228, 229, 224, 1)',
                    backdropFilter: 'blur(30px)',
                    boxShadow: '4px 3px 9.1px 4px rgba(0, 0, 0, 0.25) inset',
                    zIndex: 9999
                  }}
                >
                  <div className="flex relative" style={{ zIndex: 9999 }}>
                    {['nederland', 'turkije'].map((country) => (
                      <button
                        key={country}
                        onClick={() => setSelectedCountry(country as 'nederland' | 'turkije')}
                        className={`px-4 py-1.5 rounded-sm font-lato text-[11px] sm:text-[12px] md:text-[13px] font-normal transition-all duration-200 relative touch-manipulation ${
                          selectedCountry === country
                            ? 'text-black'
                            : 'text-gray-600 hover:text-black'
                        }`}
                        style={{
                          zIndex: 9999,
                          ...(selectedCountry === country ? {
                            boxShadow: '5px 0px 12px 0px rgba(151, 151, 151, 1)',
                            backdropFilter: 'blur(52.3px)',
                            background: 'rgba(255, 255, 255, 0.9)'
                          } : {})
                        }}
                      >
                        {country === 'nederland' ? 'Nederland' : 'Turkije'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location Icons Section */}
              <div className={`mt-16 mb-12 transition-all duration-500 ease-out ${
                iconsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                    {selectedCountry === 'nederland' && (
                      <div className="text-center">
                        <div className="text-orange-400 text-sm mb-6">
                          nl: molen, tulp en ? - turkije: moskee
                        </div>
                        <div className="flex justify-center items-center gap-8 mb-4">
                          {/* Windmill Icon for Barendrecht */}
                          <div className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            activeLocationIndex === 0 ? 'bg-gray-800 text-white' : 'bg-white text-gray-400'
                          }`}>
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L8 8h8l-4-6zm0 20l4-6H8l4 6zm10-10l-6-4v8l6-4zM2 12l6 4V8l-6 4z"/>
                            </svg>
                          </div>
                          
                          {/* Tulip Icon for Leiden */}
                          <div className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            activeLocationIndex === 1 ? 'bg-gray-800 text-white' : 'bg-white text-gray-400'
                          }`}>
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2s2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 8c0-3.3 2.7-6 6-6s6 2.7 6 6c0 1.5-.6 2.8-1.5 3.8L12 22l-4.5-8.2C6.6 12.8 6 11.5 6 10z"/>
                            </svg>
                          </div>
                          
                          {/* Question Mark for Third Location */}
                          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                            </svg>
                          </div>
                        </div>
                        
                        {/* Down Arrow */}
                        <div className="flex justify-center">
                          <svg className="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 10l5 5 5-5z"/>
                          </svg>
                        </div>
                      </div>
                    )}

                    {selectedCountry === 'turkije' && (
                      <div className="text-center">
                        <div className="text-orange-400 text-sm mb-6">
                          nl: molen, tulp en ? - turkije: moskee
                        </div>
                        <div className="flex justify-center items-center mb-4">
                          {/* Mosque Icon for Istanbul */}
                          <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-white">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 1l-2 2v2l2-2 2 2V3l-2-2zm8 9c0-2-1-3-2-3s-2 1-2 3v1h4V10zM6 10c0-2-1-3-2-3S2 8 2 10v1h4v-1zm14 3H4v8h16v-8zm-8-1c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                            </svg>
                          </div>
                        </div>
                        
                        {/* Down Arrow */}
                        <div className="flex justify-center">
                          <svg className="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 10l5 5 5-5z"/>
                          </svg>
                        </div>
                      </div>
                     )}
              </div>

              {/* Location Cards */}
                  {selectedCountry === 'nederland' && (
                    <div className={`transition-all duration-500 ease-out ${
                      locationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                      <Carousel 
                        opts={{ align: 'center', loop: false }} 
                        className="w-full max-w-sm mx-auto"
                        setApi={(api) => {
                          if (api) {
                            api.on('select', () => {
                              setActiveLocationIndex(api.selectedScrollSnap());
                            });
                          }
                        }}
                      >
                        <CarouselContent className="-ml-4">
                          {locationData.nederland.map((location, index) => (
                            <CarouselItem key={location.id} className="pl-4 basis-full">
                              <div className="text-center px-4 py-2">
                                {/* Location Title */}
                                <h3 className="text-3xl font-black text-gray-700 mb-0 tracking-tight leading-tight">{location.name}</h3>
                                <p className="text-base text-gray-500 font-normal mb-6 uppercase tracking-wider">{location.subtitle}</p>
                                
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
                        <div className="flex justify-center gap-3 mt-8">
                          {locationData.nederland.map((_, index) => (
                            <div key={index} className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              index === activeLocationIndex ? 'bg-gray-800' : 'bg-gray-400'
                            }`}></div>
                          ))}
                        </div>
                      </Carousel>
                    </div>
                  )}

                  {selectedCountry === 'turkije' && (
                    <div className={`transition-all duration-500 ease-out ${
                      locationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                      <Carousel opts={{ align: 'center', loop: false }} className="w-full max-w-sm mx-auto">
                        <CarouselContent className="-ml-4">
                          {locationData.turkije.map((location) => (
                            <CarouselItem key={location.id} className="pl-4 basis-full">
                              <div className="text-center px-4 py-2">
                                {/* Location Title */}
                                <h3 className="text-3xl font-black text-gray-700 mb-0 tracking-tight leading-tight">{location.name}</h3>
                                <p className="text-base text-gray-500 font-normal mb-6 uppercase tracking-wider">{location.subtitle}</p>
                                
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
                        
                        {/* Pagination Dots - Single dot for Turkey */}
                        <div className="flex justify-center gap-3 mt-8">
                          <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                        </div>
                      </Carousel>
                    </div>
                   )}

              {/* Contact Icons Section */}
              <div className={`mt-auto pt-12 transition-all duration-500 ease-out ${
                contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="flex items-center justify-center gap-8">
                  {/* Email */}
                  <a 
                    href="mailto:info@hairexcellence.com"
                    className="w-14 h-14 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-all duration-200"
                    aria-label="Email"
                  >
                    <Mail className="w-6 h-6 text-white" />
                  </a>
                  
                  {/* Phone */}
                  <a 
                    href="tel:0857500577"
                    className="w-14 h-14 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-all duration-200"
                    aria-label="Phone"
                  >
                    <Phone className="w-6 h-6 text-white" />
                  </a>
                  
                  {/* Instagram */}
                  <a 
                    href="https://instagram.com/hairexcellence"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6 text-white" />
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