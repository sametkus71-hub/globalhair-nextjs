import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { useQueryClient } from '@tanstack/react-query';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { OptionsStep } from './OptionsStep';
import { DateTimePicker } from './DateTimePicker';
import { CustomerInfoForm } from './CustomerInfoForm';
import { PaymentStep } from './PaymentStep';
import { getServiceConfig } from '@/lib/service-config';
import { saveBookingState, loadBookingState } from '@/lib/booking-storage';
import { useTestMode } from '@/contexts/TestModeContext';
import { FlaskConical, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export type ServiceType = 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult';
export type LocationType = 'online' | 'onsite';

export interface BookingSelection {
  date: string;
  time: string;
  staffId: string;
  staffName: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string;
  city: string;
  country: string;
}

export const BookingWizard = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { isTestMode, getTestPrice } = useTestMode();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState<string>('step-1');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  // Step 1 data
  const [consultType, setConsultType] = useState<'v6_hairboost' | 'haartransplantatie'>('haartransplantatie');
  const [location, setLocation] = useState<LocationType>('onsite');
  const [consultant, setConsultant] = useState<'trichoTeam' | 'ceo'>('trichoTeam');
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [price, setPrice] = useState<number>(50);
  
  // Step 2 data
  const [bookingSelection, setBookingSelection] = useState<BookingSelection | null>(null);
  
  // Step 3 data
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  
  // Background refresh promise for slot verification
  const refreshPromiseRef = useRef<Promise<{ slotStillAvailable: boolean }> | null>(null);

  // Load saved state on mount
  useEffect(() => {
    const saved = loadBookingState();
    if (saved) {
      setConsultType(saved.consultType);
      setLocation(saved.location);
      setConsultant(saved.consultant);
      setServiceType(saved.serviceType);
      setPrice(saved.price);
      setCurrentStep(saved.currentStep);
      setCompletedSteps(saved.completedSteps);
      if (saved.bookingSelection) {
        setBookingSelection(saved.bookingSelection);
      }
      if (saved.customerInfo) {
        setCustomerInfo(saved.customerInfo);
      }
    }
  }, []);

  // Reactive price calculation whenever selections change
  useEffect(() => {
    const derivedServiceType = consultant === 'ceo' ? 'ceo_consult' : consultType;
    try {
      const config = getServiceConfig(derivedServiceType, location);
      const finalPrice = getTestPrice(config.priceEuros);
      setPrice(finalPrice);
      setServiceType(derivedServiceType);
    } catch (error) {
      console.error('Failed to calculate price:', error);
    }
  }, [consultType, location, consultant, isTestMode, getTestPrice]);

  // Save state to session storage whenever it changes
  useEffect(() => {
    saveBookingState({
      consultType,
      location,
      consultant,
      serviceType,
      price,
      currentStep,
      completedSteps,
      bookingSelection: bookingSelection || undefined,
      customerInfo: customerInfo || undefined,
    });
  }, [consultType, location, consultant, serviceType, price, currentStep, completedSteps, bookingSelection, customerInfo]);

  const handleOptionsComplete = () => {
    setCompletedSteps([...completedSteps, 'step-1']);
    setCurrentStep('step-2');
  };

  const handleDateTimeSelect = (date: string, time: string, staffId: string, staffName: string) => {
    setBookingSelection({ date, time, staffId, staffName });
    setCompletedSteps([...completedSteps, 'step-2']);
    setCurrentStep('step-3');
    
    // Start background refresh - fire and forget but store the promise
    const refreshPromise = supabase.functions.invoke('verify-slot-availability', {
      body: {
        serviceType,
        location,
        date,
        time,
        staffId,
      },
    }).then(({ data, error }) => {
      if (error) {
        console.error('Background slot verification failed:', error);
        return { slotStillAvailable: true }; // Optimistic - let payment check handle it
      }
      console.log('Background slot verification complete:', data);
      return { slotStillAvailable: data?.slotStillAvailable ?? true };
    });
    
    refreshPromiseRef.current = refreshPromise;
  };

  const handleSlotUnavailable = () => {
    // Invalidate availability cache to force fresh data fetch
    queryClient.invalidateQueries({ queryKey: ['availability-slots'] });
    queryClient.invalidateQueries({ queryKey: ['availability-cache'] });
    
    // Clear selection and go back to Step 2
    setBookingSelection(null);
    setCompletedSteps(completedSteps.filter(s => s !== 'step-2'));
    setCurrentStep('step-2');
  };

  // Build extended booking selection with service config
  const getExtendedBookingSelection = () => {
    if (!bookingSelection || !serviceType) return null;
    
    const config = getServiceConfig(serviceType, location);
    return {
      ...bookingSelection,
      serviceId: config.serviceId,
      durationMinutes: config.durationMinutes,
    };
  };

  const handleCustomerInfoComplete = (info: CustomerInfo) => {
    setCustomerInfo(info);
  };

  return (
    <div className="w-full mx-auto">
      {isTestMode && (
        <div className="mb-4 flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg">
          <FlaskConical className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-amber-200">Test modus actief - Alle consulten €0,50</span>
        </div>
      )}
      
      <Accordion
        type="single" 
        value={currentStep}
        onValueChange={(value) => {
          // Allow navigation based on step completion
          if (value === 'step-1' || 
              (value === 'step-2' && completedSteps.includes('step-1')) ||
              (value === 'step-3' && completedSteps.includes('step-2'))) {
            setCurrentStep(value);
          }
        }}
        className="space-y-3"
      >
        {/* Step 1: Choose Option */}
        <AccordionItem 
          value="step-1" 
          className="step-gradient-border rounded-xl bg-white/5 overflow-hidden border-b-0"
          style={{
            backdropFilter: 'blur(1.6044442653656006px)',
            boxShadow: '0px 4.01px 8.72px 0px #00000040 inset, 0px -1px 4.71px 0px #FFFFFF40 inset, 0px 3.01px 1px 0px #00000040'
          }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5">
            <div className="flex items-center gap-3 w-full">
              <div 
                className="silver-gradient-border rounded-full flex items-center justify-center"
                style={{
                  width: 'clamp(32px, 4vh, 36px)',
                  height: 'clamp(32px, 4vh, 36px)',
                  backdropFilter: 'blur(5.435667037963867px)',
                  boxShadow: '0px 0px 5.16px 0px #FFFFFF40 inset',
                }}
              >
              <span className="font-inter font-normal text-sm text-white">1</span>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span 
                  className="font-inter text-left"
                  style={{ 
                    fontWeight: 400,
                    fontSize: '15px',
                    background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0px 3.39px 18.55px #FFFFFF40'
                  }}
                >
                  Kies een optie
                </span>
                {completedSteps.includes('step-1') && (
                  <Check className="w-4 h-4 text-green-400" strokeWidth={2.5} />
                )}
              </div>
              <span className="price-gold-border px-3 py-1 rounded-full bg-white/10 text-white text-xs font-inter font-medium">
                €{price}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="">
            <OptionsStep
              consultType={consultType}
              location={location}
              consultant={consultant}
              price={price}
              onConsultTypeChange={setConsultType}
              onLocationChange={setLocation}
              onConsultantChange={setConsultant}
              onNext={handleOptionsComplete}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Step 2: Select Date */}
        <AccordionItem 
          value="step-2" 
          className="step-gradient-border rounded-xl bg-white/5 overflow-hidden border-b-0"
          disabled={!completedSteps.includes('step-1')}
          style={{
            backdropFilter: 'blur(1.6044442653656006px)',
            boxShadow: '0px 4.01px 8.72px 0px #00000040 inset, 0px -1px 4.71px 0px #FFFFFF40 inset, 0px 3.01px 1px 0px #00000040'
          }}
        >
          <AccordionTrigger 
            className="px-4 py-3 hover:no-underline hover:bg-white/5"
            disabled={!completedSteps.includes('step-1')}
          >
            <div className="flex items-center gap-3 w-full">
              <div 
                className="silver-gradient-border rounded-full flex items-center justify-center"
                style={{
                  width: 'clamp(32px, 4vh, 36px)',
                  height: 'clamp(32px, 4vh, 36px)',
                  backdropFilter: 'blur(5.435667037963867px)',
                  boxShadow: '0px 0px 5.16px 0px #FFFFFF40 inset',
                  opacity: !completedSteps.includes('step-1') ? 0.5 : 1,
                }}
              >
              <span className="font-inter font-normal text-sm text-white">2</span>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span 
                  className={`font-inter text-left ${
                    !completedSteps.includes('step-1') ? 'opacity-50' : ''
                  }`}
                  style={{ 
                    fontWeight: 400,
                    fontSize: '15px',
                    background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0px 3.39px 18.55px #FFFFFF40'
                  }}
                >
                  Selecteer datum
                </span>
                {completedSteps.includes('step-2') && (
                  <Check className="w-4 h-4 text-green-400" strokeWidth={2.5} />
                )}
              </div>
              {bookingSelection && (
                <span className="px-3 py-1 rounded-full border border-white/20 text-white/70 text-xs font-inter font-medium">
                  {(() => {
                    const date = new Date(bookingSelection.date);
                    const day = date.getDate();
                    const month = date.toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', { month: 'short' }).toLowerCase();
                    return `${day} ${month}, ${bookingSelection.time}`;
                  })()}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {serviceType && location && (
              <DateTimePicker
                serviceType={serviceType}
                location={location}
                onSelect={handleDateTimeSelect}
              />
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Step 3: Confirm */}
        <AccordionItem 
          value="step-3" 
          className="step-gradient-border rounded-xl bg-white/5 overflow-hidden border-b-0"
          disabled={!completedSteps.includes('step-2')}
          style={{
            backdropFilter: 'blur(1.6044442653656006px)',
            boxShadow: '0px 4.01px 8.72px 0px #00000040 inset, 0px -1px 4.71px 0px #FFFFFF40 inset, 0px 3.01px 1px 0px #00000040'
          }}
        >
          <AccordionTrigger 
            className="px-4 py-3 hover:no-underline hover:bg-white/5"
            disabled={!completedSteps.includes('step-2')}
          >
            <div className="flex items-center gap-3 w-full">
              <div 
                className="silver-gradient-border rounded-full flex items-center justify-center"
                style={{
                  width: 'clamp(32px, 4vh, 36px)',
                  height: 'clamp(32px, 4vh, 36px)',
                  backdropFilter: 'blur(5.435667037963867px)',
                  boxShadow: '0px 0px 5.16px 0px #FFFFFF40 inset',
                  opacity: !completedSteps.includes('step-2') ? 0.5 : 1,
                }}
              >
              <span className="font-inter font-normal text-sm text-white">3</span>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span 
                  className={`font-inter text-left ${
                    !completedSteps.includes('step-2') ? 'opacity-50' : ''
                  }`}
                  style={{ 
                    fontWeight: 400,
                    fontSize: '15px',
                    background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0px 3.39px 18.55px #FFFFFF40'
                  }}
                >
                  Bevestigen
                </span>
                {completedSteps.includes('step-3') && (
                  <Check className="w-4 h-4 text-green-400" strokeWidth={2.5} />
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-6">
              <CustomerInfoForm 
                onComplete={handleCustomerInfoComplete}
                initialData={customerInfo || undefined}
              />
              
              {serviceType && location && (
                <PaymentStep
                  serviceType={serviceType}
                  location={location}
                  bookingSelection={getExtendedBookingSelection()}
                  customerInfo={customerInfo}
                  price={price}
                  refreshPromise={refreshPromiseRef.current}
                  onSlotUnavailable={handleSlotUnavailable}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <style>{`
        .silver-gradient-border {
          position: relative;
        }

        .silver-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1.3px;
          border-radius: inherit;
          background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .silver-gradient-border > * {
          position: relative;
          z-index: 1;
        }

        .step-gradient-border {
          position: relative;
        }

        .step-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(269.87deg, #4B555E 3.18%, #ACB9C1 51.79%, #FFFFFF 76.09%, #ACB9C1 88.24%, #4B555E 100.39%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .step-gradient-border > * {
          position: relative;
          z-index: 1;
        }

        .price-gold-border {
          position: relative;
        }

        .price-gold-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(135deg, #D4AF37, #F4E4BC, #D4AF37);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

      `}</style>
    </div>
  );
};
