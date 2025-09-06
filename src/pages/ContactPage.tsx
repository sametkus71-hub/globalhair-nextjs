import React, { useState, useEffect } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react';

const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { handlePopupClose } = usePopupClose();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [countryVisible, setCountryVisible] = useState(false);
  const [locationsVisible, setLocationsVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<'nederland' | 'turkije'>('nederland');

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(200);
  };

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
    const locationsTimer = setTimeout(() => setLocationsVisible(true), 600);
    const contactTimer = setTimeout(() => setContactVisible(true), 800);
    
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(countryTimer);
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
                  {t('contact.title')}
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

                  {/* Location Cards */}
                  <TabsContent value="nederland" className="mt-12">
                    <div className={`transition-all duration-500 ease-out ${
                      locationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                      {/* Location hint text */}
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center text-orange-400 text-base font-medium">
                          <span>nl: molen, tulp en ?</span>
                        </div>
                        <div className="flex justify-center mt-2">
                          <svg className="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 10l5 5 5-5z"/>
                          </svg>
                        </div>
                      </div>
                      
                      <Carousel opts={{ align: 'center', loop: false }} className="w-full max-w-sm mx-auto">
                        <CarouselContent className="-ml-4">
                          {locationData.nederland.map((location, index) => (
                            <CarouselItem key={location.id} className="pl-4 basis-full">
                              <div className="bg-white rounded-3xl p-10 shadow-xl text-center max-w-sm mx-auto">
                                {/* Location Details */}
                                <h3 className="text-4xl font-black text-gray-800 mb-2 tracking-tight">{location.name}</h3>
                                <p className="text-sm text-gray-500 font-medium mb-8 uppercase tracking-widest">{location.subtitle}</p>
                                
                                <div className="space-y-3 text-gray-700">
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
                            <div key={index} className="w-3 h-3 rounded-full bg-gray-400"></div>
                          ))}
                        </div>
                      </Carousel>
                    </div>
                  </TabsContent>

                  <TabsContent value="turkije" className="mt-12">
                    <div className={`transition-all duration-500 ease-out ${
                      locationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                      {/* Location hint text */}
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center text-orange-400 text-base font-medium">
                          <span>turkije: moskee</span>
                        </div>
                        <div className="flex justify-center mt-2">
                          <svg className="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 10l5 5 5-5z"/>
                          </svg>
                        </div>
                      </div>
                      
                      <Carousel opts={{ align: 'center', loop: false }} className="w-full max-w-sm mx-auto">
                        <CarouselContent className="-ml-4">
                          {locationData.turkije.map((location) => (
                            <CarouselItem key={location.id} className="pl-4 basis-full">
                              <div className="bg-white rounded-3xl p-10 shadow-xl text-center max-w-sm mx-auto">
                                {/* Location Details */}
                                <h3 className="text-4xl font-black text-gray-800 mb-2 tracking-tight">{location.name}</h3>
                                <p className="text-sm text-gray-500 font-medium mb-8 uppercase tracking-widest">{location.subtitle}</p>
                                
                                <div className="space-y-3 text-gray-700">
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
                          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
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