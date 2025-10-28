import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { getServiceConfig } from '@/lib/service-config';
import { ServiceType, LocationType } from './BookingWizard';

interface OptionsStepProps {
  onNext: (data: {
    consultType: 'v6_hairboost' | 'haartransplantatie';
    location: LocationType;
    consultant: 'trichoTeam' | 'ceo';
    serviceType: ServiceType;
    price: number;
  }) => void;
}

export const OptionsStep = ({ onNext }: OptionsStepProps) => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  
  const [consultType, setConsultType] = useState<'v6_hairboost' | 'haartransplantatie'>('v6_hairboost');
  const [location, setLocation] = useState<LocationType>('onsite');
  const [consultant, setConsultant] = useState<'trichoTeam' | 'ceo'>('trichoTeam');

  const calculatePrice = () => {
    if (consultant === 'ceo') return 500;
    if (consultType === 'v6_hairboost') return 50;
    if (consultType === 'haartransplantatie') return 75;
    return 0;
  };

  const getDerivedServiceType = (): ServiceType => {
    if (consultant === 'ceo') return 'ceo_consult';
    return consultType;
  };

  const handleNext = () => {
    const serviceType = getDerivedServiceType();
    const price = calculatePrice();
    onNext({ consultType, location, consultant, serviceType, price });
  };

  const price = calculatePrice();

  return (
    <div className="space-y-6 p-4">
      {/* Consult Type Toggle */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground/80">
          {t('booking.consultType')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setConsultType('v6_hairboost')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              consultType === 'v6_hairboost'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card/50 text-card-foreground hover:bg-card/80'
            }`}
          >
            {t('booking.basicConsult')}
          </button>
          <button
            onClick={() => setConsultType('haartransplantatie')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              consultType === 'haartransplantatie'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card/50 text-card-foreground hover:bg-card/80'
            }`}
          >
            {t('booking.trichoScan')}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          {consultType === 'v6_hairboost' 
            ? t('booking.basicConsultDesc')
            : t('booking.trichoScanDesc')
          }
        </p>
      </div>

      {/* Location Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground/80">
          {t('booking.locationLabel')}
        </label>
        <div className="space-y-2">
          <button
            onClick={() => setLocation('onsite')}
            className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              location === 'onsite'
                ? 'bg-primary/20 border-2 border-primary'
                : 'bg-card/50 border-2 border-transparent hover:bg-card/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                location === 'onsite' ? 'border-primary' : 'border-border'
              }`}>
                {location === 'onsite' && (
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                )}
              </div>
              <span className="text-sm font-medium">{t('booking.onLocation')}</span>
            </div>
          </button>
          <button
            onClick={() => setLocation('online')}
            className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              location === 'online'
                ? 'bg-primary/20 border-2 border-primary'
                : 'bg-card/50 border-2 border-transparent hover:bg-card/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                location === 'online' ? 'border-primary' : 'border-border'
              }`}>
                {location === 'online' && (
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                )}
              </div>
              <span className="text-sm font-medium">{t('booking.videoCall')}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Consultant Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground/80">
          {t('booking.selectConsultant')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setConsultant('trichoTeam')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              consultant === 'trichoTeam'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card/50 text-card-foreground hover:bg-card/80'
            }`}
          >
            {t('booking.trichoTeam')}
          </button>
          <button
            onClick={() => setConsultant('ceo')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              consultant === 'ceo'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card/50 text-card-foreground hover:bg-card/80'
            }`}
          >
            {t('booking.ceo')}
          </button>
        </div>
      </div>

      {/* Price Display */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-card/50">
        <span className="text-sm font-medium text-foreground/80">
          {t('booking.totalPrice')}
        </span>
        <span className="text-2xl font-bold text-primary">€{price}</span>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full px-6 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 shadow-lg"
      >
        {t('booking.next')} →
      </button>
    </div>
  );
};