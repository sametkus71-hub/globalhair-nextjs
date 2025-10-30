import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { LocationType } from './BookingWizard';
import { MapPin, Video, Phone } from 'lucide-react';

interface OptionsStepProps {
  consultType: 'v6_hairboost' | 'haartransplantatie';
  location: LocationType;
  consultant: 'trichoTeam' | 'ceo';
  price: number;
  onConsultTypeChange: (type: 'v6_hairboost' | 'haartransplantatie') => void;
  onLocationChange: (loc: LocationType) => void;
  onConsultantChange: (cons: 'trichoTeam' | 'ceo') => void;
  onNext: () => void;
}

export const OptionsStep = ({ 
  consultType, 
  location, 
  consultant, 
  price,
  onConsultTypeChange,
  onLocationChange,
  onConsultantChange,
  onNext 
}: OptionsStepProps) => {
  const { language } = useLanguage();

  const getConsultDescription = () => {
    if (consultType === 'v6_hairboost') {
      return language === 'nl' 
        ? 'Persoonlijk consult voor V6 Hairboost behandeling. Krijg advies over onze revolutionaire haargroei formule en ontdek of deze behandeling geschikt is voor jou. Duur: 30 minuten'
        : 'Personal consultation for V6 Hairboost treatment. Get advice about our revolutionary hair growth formula and discover if this treatment is suitable for you. Duration: 30 minutes';
    } else {
      return language === 'nl'
        ? 'Uitgebreid consult met TrichoScan™ analyse voor haartransplantatie. Bespreek jouw wensen, krijg een professionele haaranalyse en ontvang een persoonlijk behandelplan. Duur: 45 minuten'
        : 'Comprehensive consultation with TrichoScan™ analysis for hair transplantation. Discuss your wishes, receive a professional hair analysis and get a personal treatment plan. Duration: 45 minutes';
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Consult Type Toggle */}
      <div className="space-y-3">
        <div className="flex justify-start">
          <div className="inline-flex rounded-full bg-white/5 p-1.5 gap-2">
            <button
              onClick={() => onConsultTypeChange('v6_hairboost')}
              className={`px-4 py-1.5 rounded-full text-xs font-inter font-normal transition-all duration-300 ease-out ${
                consultType === 'v6_hairboost'
                  ? 'silver-gradient-border text-white scale-105'
                  : 'text-white/60 hover:text-white scale-100'
              }`}
              style={consultType === 'v6_hairboost' ? { textShadow: '0 0 20px rgba(255, 255, 255, 0.6)' } : {}}
            >
              V6 Hairboost consult
            </button>
            <button
              onClick={() => onConsultTypeChange('haartransplantatie')}
              className={`px-4 py-1.5 rounded-full text-xs font-inter font-normal transition-all duration-300 ease-out ${
                consultType === 'haartransplantatie'
                  ? 'silver-gradient-border text-white scale-105'
                  : 'text-white/60 hover:text-white scale-100'
              }`}
              style={consultType === 'haartransplantatie' ? { textShadow: '0 0 20px rgba(255, 255, 255, 0.6)' } : {}}
            >
              Haartransplantatie consult
            </button>
          </div>
        </div>
        
        <p className="text-xs font-inter text-white/50 leading-relaxed">
          {getConsultDescription()}
        </p>
      </div>

      {/* Location Selection */}
      <div className="space-y-2">
        <button
          onClick={() => onLocationChange('onsite')}
          className={`w-full px-3 py-3 rounded text-left transition-all duration-200 flex items-center gap-2.5 ${
            location === 'onsite'
              ? 'bg-[#FFFFFF1F] border border-green-500'
              : 'bg-[#FFFFFF1F] border border-white/10 hover:bg-white/10'
          }`}
        >
          <MapPin className="w-4 h-4 text-white/70 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-xs font-inter font-normal text-white">Op locatie</span>
            <span className="text-xs font-inter text-white/50 ml-1.5">(Barendrecht)</span>
          </div>
        </button>
        
        <button
          onClick={() => onLocationChange('online')}
          className={`w-full px-3 py-3 rounded text-left transition-all duration-200 flex items-center gap-2.5 ${
            location === 'online'
              ? 'bg-[#FFFFFF1F] border border-green-500'
              : 'bg-[#FFFFFF1F] border border-white/10 hover:bg-white/10'
          }`}
        >
          <Video className="w-4 h-4 text-white/70 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-xs font-inter font-normal text-white">Videocall</span>
          </div>
        </button>
      </div>

      {/* Consultant Selection */}
      <div className="space-y-2">
        <label className="text-xs font-inter font-normal text-white/70">
          Selecteer consultant
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onConsultantChange('trichoTeam')}
            className={`flex-1 px-3 py-3 rounded text-center transition-all duration-200 ${
              consultant === 'trichoTeam'
                ? 'bg-[#FFFFFF1F] border border-green-500'
                : 'bg-[#FFFFFF1F] border border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-xs font-inter font-normal text-white">TrichoTeam</span>
          </button>
          <button
            onClick={() => onConsultantChange('ceo')}
            className={`flex-1 px-3 py-3 rounded text-center transition-all duration-200 ${
              consultant === 'ceo'
                ? 'bg-[#FFFFFF1F] border border-green-500'
                : 'bg-[#FFFFFF1F] border border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-xs font-inter font-normal text-white">CEO - Berkant Dural</span>
          </button>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="w-full px-4 py-3 rounded bg-[#FFFFFF1F] hover:bg-white/15 border border-white/20 text-white font-inter font-normal transition-all duration-200 text-sm"
      >
        Volgende
      </button>
    </div>
  );
};

const styles = `
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
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}