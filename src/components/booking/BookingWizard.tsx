import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
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
import { FlaskConical } from 'lucide-react';

export type ServiceType = 'v6_hairboost' | 'haartransplantatie' | 'ceo_consult';
export type LocationType = 'online' | 'onsite';

export interface BookingSelection {
  date: string;
  time: string;
  staffId: string;
  staffName: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  notes: string;
}

export const BookingWizard = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { isTestMode, getTestPrice } = useTestMode();
  
  const [currentStep, setCurrentStep] = useState<string>('step-1');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  // Step 1 data
  const [consultType, setConsultType] = useState<'v6_hairboost' | 'haartransplantatie'>('v6_hairboost');
  const [location, setLocation] = useState<LocationType>('onsite');
  const [consultant, setConsultant] = useState<'trichoTeam' | 'ceo'>('trichoTeam');
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [price, setPrice] = useState<number>(50);
  
  // Step 2 data
  const [bookingSelection, setBookingSelection] = useState<BookingSelection | null>(null);
  
  // Step 3 data
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

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
    });
  }, [consultType, location, consultant, serviceType, price, currentStep, completedSteps]);

  const handleOptionsComplete = () => {
    setCompletedSteps([...completedSteps, 'step-1']);
    setCurrentStep('step-2');
  };

  const handleDateTimeSelect = (date: string, time: string, staffId: string, staffName: string) => {
    setBookingSelection({ date, time, staffId, staffName });
    setCompletedSteps([...completedSteps, 'step-2']);
    setCurrentStep('step-3');
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
          // Only allow navigation to completed steps or current step
          if (value === 'step-1' || completedSteps.includes(value) || value === currentStep) {
            setCurrentStep(value);
          }
        }}
        className="space-y-3"
      >
        {/* Step 1: Choose Option */}
        <AccordionItem 
          value="step-1" 
          className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-md overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5">
            <div className="flex items-center gap-3 w-full">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
                completedSteps.includes('step-1')
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-transparent border-white/30 text-white/90'
              }`}>
                <span className="font-inter font-normal text-sm">1</span>
              </div>
              <span className="font-inter font-normal text-sm flex-1 text-left text-white">
                Kies een optie
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-inter font-medium">
                €{price}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-white/10">
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
          className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-md overflow-hidden"
          disabled={!completedSteps.includes('step-1')}
        >
          <AccordionTrigger 
            className="px-4 py-3 hover:no-underline hover:bg-white/5"
            disabled={!completedSteps.includes('step-1')}
          >
            <div className="flex items-center gap-3 w-full">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
                completedSteps.includes('step-2')
                  ? 'bg-white/20 border-white/40 text-white'
                  : completedSteps.includes('step-1')
                  ? 'bg-transparent border-white/30 text-white/90'
                  : 'bg-transparent border-white/20 text-white/40'
              }`}>
                <span className="font-inter font-normal text-sm">2</span>
              </div>
              <span className={`font-inter font-normal text-sm flex-1 text-left text-white ${
                !completedSteps.includes('step-1') ? 'opacity-50' : ''
              }`}>
                Selecteer datum
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-white/10 px-4 pb-4">
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
          className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-md overflow-hidden"
          disabled={!completedSteps.includes('step-2')}
        >
          <AccordionTrigger 
            className="px-4 py-3 hover:no-underline hover:bg-white/5"
            disabled={!completedSteps.includes('step-2')}
          >
            <div className="flex items-center gap-3 w-full">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
                completedSteps.includes('step-3')
                  ? 'bg-white/20 border-white/40 text-white'
                  : completedSteps.includes('step-2')
                  ? 'bg-transparent border-white/30 text-white/90'
                  : 'bg-transparent border-white/20 text-white/40'
              }`}>
                <span className="font-inter font-normal text-sm">3</span>
              </div>
              <span className={`font-inter font-normal text-sm flex-1 text-left text-white ${
                !completedSteps.includes('step-2') ? 'opacity-50' : ''
              }`}>
                Bevestigen
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-white/10 px-4 pb-4">
            <div className="space-y-6">
              <CustomerInfoForm onComplete={handleCustomerInfoComplete} />
              
              {serviceType && location && bookingSelection && getExtendedBookingSelection() && (
                <PaymentStep
                  serviceType={serviceType}
                  location={location}
                  bookingSelection={getExtendedBookingSelection()!}
                  customerInfo={customerInfo}
                  price={price}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
