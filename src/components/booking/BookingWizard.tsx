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
          className="border rounded-xl bg-card/50 backdrop-blur-sm overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-4 w-full">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                completedSteps.includes('step-1')
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {completedSteps.includes('step-1') ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">1</span>
                )}
              </div>
              <span className="font-medium text-lg flex-1 text-left">
                {t('booking.step1Title')}
              </span>
              {completedSteps.includes('step-1') && (
                <span className="text-xl font-bold text-primary">€{price}</span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <OptionsStep onNext={handleOptionsComplete} />
          </AccordionContent>
        </AccordionItem>

        {/* Step 2: Select Date */}
        <AccordionItem 
          value="step-2" 
          className="border rounded-xl bg-card/50 backdrop-blur-sm overflow-hidden"
          disabled={!completedSteps.includes('step-1')}
        >
          <AccordionTrigger 
            className="px-6 py-4 hover:no-underline"
            disabled={!completedSteps.includes('step-1')}
          >
            <div className="flex items-center gap-4 w-full">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                completedSteps.includes('step-2')
                  ? 'bg-primary text-primary-foreground'
                  : completedSteps.includes('step-1')
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-muted/50 text-muted-foreground/50'
              }`}>
                {completedSteps.includes('step-2') ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">2</span>
                )}
              </div>
              <span className={`font-medium text-lg flex-1 text-left ${
                !completedSteps.includes('step-1') ? 'opacity-50' : ''
              }`}>
                {t('booking.step2Title')}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
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
          className="border rounded-xl bg-card/50 backdrop-blur-sm overflow-hidden"
          disabled={!completedSteps.includes('step-2')}
        >
          <AccordionTrigger 
            className="px-6 py-4 hover:no-underline"
            disabled={!completedSteps.includes('step-2')}
          >
            <div className="flex items-center gap-4 w-full">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                completedSteps.includes('step-3')
                  ? 'bg-primary text-primary-foreground'
                  : completedSteps.includes('step-2')
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-muted/50 text-muted-foreground/50'
              }`}>
                {completedSteps.includes('step-3') ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">3</span>
                )}
              </div>
              <span className={`font-medium text-lg flex-1 text-left ${
                !completedSteps.includes('step-2') ? 'opacity-50' : ''
              }`}>
                {t('booking.step3Title')}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
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
