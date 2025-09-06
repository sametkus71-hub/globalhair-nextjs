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
              <div className={`text-center mb-12 md:mb-16 transition-all duration-500 ease-out ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-700 mb-6 leading-[0.9] tracking-tight">
                  {t('contact.title')}
                </h1>
                <p className="text-base md:text-lg text-gray-500 font-normal">
                  {t('contact.subtitle')}
                </p>
              </div>

              {/* Country Selection */}
              <div className={`mb-8 md:mb-12 transition-all duration-500 ease-out ${
                countryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <Tabs value={selectedCountry} onValueChange={(value) => setSelectedCountry(value as 'nederland' | 'turkije')} className="w-full">
                  <TabsList className="w-full max-w-sm mx-auto grid grid-cols-2 bg-white/60 backdrop-blur-sm">
                    <TabsTrigger 
                      value="nederland" 
                      className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600 font-medium"
                    >
                      {t('contact.countries.nederland')}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="turkije"
                      className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600 font-medium"
                    >
                      {t('contact.countries.turkije')}
                    </TabsTrigger>
                  </TabsList>

                  {/* Location Cards */}
                  <TabsContent value="nederland" className="mt-8">
                    <div className={`transition-all duration-500 ease-out ${
                      locationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                      <Carousel opts={{ align: 'start', loop: false }} className="w-full">
                        <CarouselContent className="-ml-2 md:-ml-4">
                          {locationData.nederland.map((location) => (
                            <CarouselItem key={location.id} className="pl-2 md:pl-4 basis-full md:basis-1/2">
                              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:bg-white/90 transition-all duration-300">
                                {/* Location Icon */}
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                  <MapPin className="w-6 h-6 text-gray-600" />
                                </div>
                                
                                {/* Location Details */}
                                <h3 className="text-xl font-black text-gray-800 mb-1">{location.name}</h3>
                                <p className="text-sm text-gray-500 font-medium mb-4">{location.subtitle}</p>
                                
                                <div className="space-y-2 text-sm text-gray-600">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                    <span>{location.address}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>{location.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>{location.hours}</span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                  <span className="text-xs text-gray-500 font-medium">{location.province}</span>
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  </TabsContent>

                  <TabsContent value="turkije" className="mt-8">
                    <div className={`transition-all duration-500 ease-out ${
                      locationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                      <Carousel opts={{ align: 'start', loop: false }} className="w-full">
                        <CarouselContent className="-ml-2 md:-ml-4">
                          {locationData.turkije.map((location) => (
                            <CarouselItem key={location.id} className="pl-2 md:pl-4 basis-full">
                              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:bg-white/90 transition-all duration-300 max-w-md mx-auto">
                                {/* Location Icon */}
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                  <MapPin className="w-6 h-6 text-gray-600" />
                                </div>
                                
                                {/* Location Details */}
                                <h3 className="text-xl font-black text-gray-800 mb-1">{location.name}</h3>
                                <p className="text-sm text-gray-500 font-medium mb-4">{location.subtitle}</p>
                                
                                <div className="space-y-2 text-sm text-gray-600">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                    <span>{location.address}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>{location.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>{location.hours}</span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                  <span className="text-xs text-gray-500 font-medium">{location.province}</span>
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Contact Icons Section */}
              <div className={`mt-auto pt-8 transition-all duration-500 ease-out ${
                contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="flex items-center justify-center gap-6">
                  {/* Email */}
                  <a 
                    href="mailto:info@hairexcellence.com"
                    className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 active:scale-95 transition-all duration-200"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5 text-white" />
                  </a>
                  
                  {/* Phone */}
                  <a 
                    href="tel:0857500577"
                    className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 active:scale-95 transition-all duration-200"
                    aria-label="Phone"
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </a>
                  
                  {/* Instagram */}
                  <a 
                    href="https://instagram.com/hairexcellence"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 active:scale-95 transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-white" />
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