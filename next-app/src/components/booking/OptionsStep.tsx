'use client';

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
        ? (
          <>
            Persoonlijk consult voor V6 Hairboost® behandeling. Krijg advies over onze haargroei formule en ontdek of deze behandeling geschikt is voor jou. <span style={{ color: '#FFFFFF' }}>Duur: 30 minuten</span>
          </>
        )
        : (
          <>
            Personal consultation for V6 Hairboost® treatment. Get advice about our hair growth formula and discover if this treatment is suitable for you. <span style={{ color: '#FFFFFF' }}>Duration: 30 minutes</span>
          </>
        );
    } else {
      return language === 'nl'
        ? (
          <>
            Persoonlijk consult voor haartransplantatie. Ontvang professioneel advies over de beste behandeling voor jouw situatie en ontdek welke transplantatiemethode het beste resultaat biedt. <span style={{ color: '#FFFFFF' }}>Duur: 45 minuten</span>
          </>
        )
        : (
          <>
            Personal consultation for hair transplantation. Receive professional advice about the best treatment for your situation and discover which transplantation method provides the best results. <span style={{ color: '#FFFFFF' }}>Duration: 45 minutes</span>
          </>
        );
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Consult Type Toggle */}
      <div className="space-y-3">
        <p className="text-xs font-inter font-normal text-white/70 text-center">
          Kies een consult
        </p>
        <div className="flex justify-center" style={{ marginTop: '4px' }}>
          <div className="inline-flex rounded-full bg-white/5 p-1.5 gap-2 w-full">
            <button
              onClick={() => onConsultTypeChange('haartransplantatie')}
              className={`flex-1 px-4 rounded-full text-xs font-inter font-normal transition-all duration-300 ease-out ${consultType === 'haartransplantatie'
                  ? 'silver-gradient-border text-white scale-105'
                  : 'text-white/60 hover:text-white scale-100'
                }`}
              style={consultType === 'haartransplantatie' ? { textShadow: '0 0 20px rgba(255, 255, 255, 0.6)', paddingTop: '0.775rem', paddingBottom: '0.775rem' } : { paddingTop: '0.775rem', paddingBottom: '0.775rem' }}
            >
              Haartransplantatie
            </button>
            <button
              onClick={() => onConsultTypeChange('v6_hairboost')}
              className={`flex-1 px-4 rounded-full text-xs font-inter font-normal transition-all duration-300 ease-out ${consultType === 'v6_hairboost'
                  ? 'silver-gradient-border text-white scale-105'
                  : 'text-white/60 hover:text-white scale-100'
                }`}
              style={consultType === 'v6_hairboost' ? { textShadow: '0 0 20px rgba(255, 255, 255, 0.6)', paddingTop: '0.775rem', paddingBottom: '0.775rem' } : { paddingTop: '0.775rem', paddingBottom: '0.775rem' }}
            >
              V6 Hairboost®
            </button>
          </div>
        </div>

        <p
          className="leading-relaxed"
          style={{
            fontSize: '10px',
            fontFamily: 'Inter',
            fontWeight: 300,
            color: '#CFCFCF'
          }}
        >
          {getConsultDescription()}
        </p>
      </div>

      {/* Location Selection */}
      <div className="space-y-2">
        <button
          onClick={() => onLocationChange('onsite')}
          className={`w-full px-3 py-3 rounded text-left transition-all duration-200 flex items-center gap-2.5 ${location === 'onsite'
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
          className={`w-full px-3 py-3 rounded text-left transition-all duration-200 flex items-center gap-2.5 ${location === 'online'
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
            className={`flex-1 px-3 py-3 rounded text-center transition-all duration-200 ${consultant === 'trichoTeam'
                ? 'bg-[#FFFFFF1F] border border-green-500'
                : 'bg-[#FFFFFF1F] border border-white/10 hover:bg-white/10'
              }`}
          >
            <span className="text-xs font-inter font-normal text-white">TrichoTeam</span>
          </button>
          <button
            onClick={() => onConsultantChange('ceo')}
            className={`flex-1 px-3 py-3 rounded text-center transition-all duration-200 ${consultant === 'ceo'
                ? 'bg-[#FFFFFF1F] border border-green-500'
                : 'bg-[#FFFFFF1F] border border-white/10 hover:bg-white/10'
              }`}
          >
            <span className="text-xs font-inter font-normal text-white">CEO - Berkant Dural</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div
        className="w-full h-px"
        style={{
          backgroundColor: '#D9D9D9',
          opacity: 0.22
        }}
      />

      {/* Next Button */}
      <button
        onClick={onNext}
        className="silver-gradient-border button-glow w-full px-4 rounded-full text-white font-inter font-normal transition-all duration-200 text-sm relative overflow-hidden"
        style={{
          background: 'linear-gradient(93.06deg, rgba(255, 255, 255, 0) 1%, rgba(203, 203, 203, 0.2) 51.84%, rgba(153, 153, 153, 0) 100%)',
          backdropFilter: 'blur(5.435667037963867px)',
          boxShadow: '0px 0px 5.16px 0px #FFFFFF40 inset, 0px 4.07px 6.2px 0px #00000040 inset',
          paddingTop: '15px',
          paddingBottom: '15px',
        }}
      >
        <span className="relative z-10">Volgende</span>
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

  .button-glow::after {
    content: "";
    position: absolute;
    bottom: -17px;
    left: 50%;
    transform: translateX(-50%);
    width: 56%;
    height: 50%;
    background: #7990A5;
    filter: blur(11px);
    opacity: 0.8;
    border-radius: 20%;
    z-index: 0;
    pointer-events: none;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}