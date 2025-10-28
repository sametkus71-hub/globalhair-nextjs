import { useState } from 'react';
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
import { Check } from 'lucide-react';

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
  notes: string;
}

export const BookingWizard = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  
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

  const handleOptionsComplete = (data: {
    consultType: 'v6_hairboost' | 'haartransplantatie';
    location: LocationType;
    consultant: 'trichoTeam' | 'ceo';
    serviceType: ServiceType;
    price: number;
  }) => {
    setConsultType(data.consultType);
    setLocation(data.location);
    setConsultant(data.consultant);
    setServiceType(data.serviceType);
    setPrice(data.price);
    setCompletedSteps([...completedSteps, 'step-1']);
    setCurrentStep('step-2');
  };

  const handleDateTimeSelect = (date: string, time: string, staffId: string, staffName: string) => {
    setBookingSelection({ date, time, staffId, staffName });
    setCompletedSteps([...completedSteps, 'step-2']);
    setCurrentStep('step-3');
  };

  const handleCustomerInfoComplete = (info: CustomerInfo) => {
    setCustomerInfo(info);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Accordion 
        type="single" 
        value={currentStep}
        onValueChange={(value) => {
          // Only allow navigation to completed steps or current step
          if (value === 'step-1' || completedSteps.includes(value) || value === currentStep) {
            setCurrentStep(value);
          }
        }}
        className="space-y-4"
      >
        {/* Step 1: Choose Option */}
        <AccordionItem 
          value="step-1" 
          className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden shadow-xl"
        >
          <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-white/5">
            <div className="flex items-center gap-4 w-full">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 ${
                completedSteps.includes('step-1')
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-white/5 border-white/20 text-white/80'
              }`}>
                {completedSteps.includes('step-1') ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="font-bold text-lg">1</span>
                )}
              </div>
              <span className="font-medium text-lg flex-1 text-left text-white">
                Kies een optie
              </span>
              {completedSteps.includes('step-1') && (
                <span className="px-4 py-1.5 rounded-full bg-white/10 text-white text-base font-semibold">
                  €{price}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-white/10">
            <OptionsStep onNext={handleOptionsComplete} />
          </AccordionContent>
        </AccordionItem>

        {/* Step 2: Select Date */}
        <AccordionItem 
          value="step-2" 
          className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden shadow-xl"
          disabled={!completedSteps.includes('step-1')}
        >
          <AccordionTrigger 
            className="px-6 py-5 hover:no-underline hover:bg-white/5"
            disabled={!completedSteps.includes('step-1')}
          >
            <div className="flex items-center gap-4 w-full">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 ${
                completedSteps.includes('step-2')
                  ? 'bg-white/20 border-white/40 text-white'
                  : completedSteps.includes('step-1')
                  ? 'bg-white/5 border-white/20 text-white/80'
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}>
                {completedSteps.includes('step-2') ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="font-bold text-lg">2</span>
                )}
              </div>
              <span className={`font-medium text-lg flex-1 text-left text-white ${
                !completedSteps.includes('step-1') ? 'opacity-50' : ''
              }`}>
                Selecteer datum
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-white/10 px-6 pb-6">
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
          className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden shadow-xl"
          disabled={!completedSteps.includes('step-2')}
        >
          <AccordionTrigger 
            className="px-6 py-5 hover:no-underline hover:bg-white/5"
            disabled={!completedSteps.includes('step-2')}
          >
            <div className="flex items-center gap-4 w-full">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 ${
                completedSteps.includes('step-3')
                  ? 'bg-white/20 border-white/40 text-white'
                  : completedSteps.includes('step-2')
                  ? 'bg-white/5 border-white/20 text-white/80'
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}>
                {completedSteps.includes('step-3') ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="font-bold text-lg">3</span>
                )}
              </div>
              <span className={`font-medium text-lg flex-1 text-left text-white ${
                !completedSteps.includes('step-2') ? 'opacity-50' : ''
              }`}>
                Bevestigen
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-white/10 px-6 pb-6">
            <div className="space-y-6">
              <CustomerInfoForm onComplete={handleCustomerInfoComplete} />
              
              {customerInfo && serviceType && location && bookingSelection && (
                <PaymentStep
                  serviceType={serviceType}
                  location={location}
                  bookingSelection={bookingSelection}
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
