import React, { useState, useEffect } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
        name: t('contact.locations.barendrecht.name'),
        subtitle: t('contact.locations.barendrecht.subtitle'),
        address: t('contact.locations.barendrecht.address'),
        phone: t('contact.locations.barendrecht.phone'),
        hours: t('contact.locations.barendrecht.hours'),
        province: t('contact.locations.barendrecht.province'),
      },
      {
        id: 'leiden',
        name: t('contact.locations.leiden.name'),
        subtitle: t('contact.locations.leiden.subtitle'),
        address: t('contact.locations.leiden.address'),
        phone: t('contact.locations.leiden.phone'),
        hours: t('contact.locations.leiden.hours'),
        province: t('contact.locations.leiden.province'),
      },
    ],
    turkije: [
      {
        id: 'istanbul',
        name: t('contact.locations.istanbul.name'),
        subtitle: t('contact.locations.istanbul.subtitle'),
        address: t('contact.locations.istanbul.address'),
        phone: t('contact.locations.istanbul.phone'),
        hours: t('contact.locations.istanbul.hours'),
        province: t('contact.locations.istanbul.province'),
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
              <div className={`text-center mb-16 transition-all duration-500 ease-out ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-700 mb-4 leading-tight tracking-tight">
                  MEET YOUR
                  <br />
                  FUTURE HAIRLINE
                </h1>
              </div>

              {/* Country Selection */}
              <div className={`mb-12 transition-all duration-500 ease-out ${
                countryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <Tabs value={selectedCountry} onValueChange={(value) => setSelectedCountry(value as 'nederland' | 'turkije')} className="w-full">
                  <TabsList className="w-full max-w-lg mx-auto grid grid-cols-2 bg-white/90 backdrop-blur-sm rounded-full p-2 h-14 border-0">
                    <TabsTrigger 
                      value="nederland" 
                      className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=inactive]:text-gray-500 text-base font-medium rounded-full px-8 py-2 transition-all duration-200"
                    >
                      NEDERLAND
                    </TabsTrigger>
                    <TabsTrigger 
                      value="turkije"
                      className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=inactive]:text-gray-500 text-base font-medium rounded-full px-8 py-2 transition-all duration-200"
                    >
                      TURKIJE
                    </TabsTrigger>
                  </TabsList>

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
                  <TabsContent value="nederland" className="mt-0">
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
                              <div className="bg-white rounded-3xl p-10 shadow-xl text-center">
                                <h3 className="text-4xl font-black text-gray-800 mb-2 tracking-tight">{location.name}</h3>
                                <p className="text-sm text-gray-500 font-medium mb-8 uppercase tracking-widest">{location.subtitle}</p>
                                
                                <div className="space-y-3 text-gray-700 text-left">
                                  <div>
                                    <p className="text-sm leading-relaxed"><span className="font-medium">Adres:</span> {location.address}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm leading-relaxed"><span className="font-medium">Telefoon:</span> {location.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm leading-relaxed"><span className="font-medium">Openingstijden:</span> {location.hours}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm leading-relaxed"><span className="font-medium">Provincie:</span> {location.province}</p>
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
                  </TabsContent>

                  <TabsContent value="turkije" className="mt-0">
                    <div className={`transition-all duration-500 ease-out ${
                      locationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                      <Carousel opts={{ align: 'center', loop: false }} className="w-full max-w-sm mx-auto">
                        <CarouselContent className="-ml-4">
                          {locationData.turkije.map((location) => (
                            <CarouselItem key={location.id} className="pl-4 basis-full">
                              <div className="bg-white rounded-3xl p-10 shadow-xl text-center">
                                <h3 className="text-4xl font-black text-gray-800 mb-2 tracking-tight">{location.name}</h3>
                                <p className="text-sm text-gray-500 font-medium mb-8 uppercase tracking-widest">{location.subtitle}</p>
                                
                                <div className="space-y-3 text-gray-700 text-left">
                                  <div>
                                    <p className="text-sm leading-relaxed"><span className="font-medium">Adres:</span> {location.address}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm leading-relaxed"><span className="font-medium">Telefoon:</span> {location.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm leading-relaxed"><span className="font-medium">Openingstijden:</span> {location.hours}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm leading-relaxed"><span className="font-medium">Provincie:</span> {location.province}</p>
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
                  </TabsContent>
                </Tabs>
              </div>

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