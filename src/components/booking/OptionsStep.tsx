import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { getServiceConfig } from '@/lib/service-config';
import { ServiceType, LocationType } from './BookingWizard';
import { MapPin, Video, Phone } from 'lucide-react';

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
    <div className="space-y-6 p-6">
      {/* Consult Type Toggle */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-white/20 bg-white/5 p-1">
            <button
              onClick={() => setConsultType('v6_hairboost')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                consultType === 'v6_hairboost'
                  ? 'bg-white/90 text-slate-900'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Basic consult
            </button>
            <button
              onClick={() => setConsultType('haartransplantatie')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                consultType === 'haartransplantatie'
                  ? 'bg-white/90 text-slate-900'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              TrichoScan™
            </button>
          </div>
        </div>
        
        <p className="text-sm text-white/60 text-center leading-relaxed px-2">
          {consultType === 'v6_hairboost' 
            ? t('booking.basicConsultDesc')
            : t('booking.trichoScanDesc')
          }
        </p>
      </div>

      {/* Location Selection */}
      <div className="space-y-3">
        <button
          onClick={() => setLocation('onsite')}
          className={`w-full px-4 py-4 rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${
            location === 'onsite'
              ? 'bg-white/15 border border-white/30'
              : 'bg-white/5 border border-white/10 hover:bg-white/10'
          }`}
        >
          <MapPin className="w-5 h-5 text-white/80" />
          <div className="flex-1">
            <span className="text-sm font-medium text-white">Op locatie</span>
            <span className="text-xs text-white/60 ml-2">(Barendrecht)</span>
          </div>
        </button>
        
        <button
          onClick={() => setLocation('online')}
          className={`w-full px-4 py-4 rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${
            location === 'online'
              ? 'bg-white/15 border border-white/30'
              : 'bg-white/5 border border-white/10 hover:bg-white/10'
          }`}
        >
          <Video className="w-5 h-5 text-white/80" />
          <span className="text-sm font-medium text-white">Videocall</span>
        </button>
        
        <button
          onClick={() => setLocation('online')}
          className="w-full px-4 py-4 rounded-xl text-left transition-all duration-200 flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 opacity-50 cursor-not-allowed"
          disabled
        >
          <Phone className="w-5 h-5 text-white/80" />
          <span className="text-sm font-medium text-white">Telefoon</span>
        </button>
      </div>

      {/* Consultant Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/80">
          Selecteer consultant
        </label>
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-white/20 bg-white/5 p-1 w-full">
            <button
              onClick={() => setConsultant('trichoTeam')}
              className={`flex-1 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                consultant === 'trichoTeam'
                  ? 'bg-white/90 text-slate-900'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              TrichoTeam
            </button>
            <button
              onClick={() => setConsultant('ceo')}
              className={`flex-1 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                consultant === 'ceo'
                  ? 'bg-white/90 text-slate-900'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              CEO - Berkant Dural
            </button>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium transition-all duration-200 shadow-lg text-base"
      >
        Volgende
      </button>
    </div>
  );
};