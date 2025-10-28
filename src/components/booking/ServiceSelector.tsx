import { useLanguage } from '@/hooks/useLanguage';
import { ServiceType, LocationType } from './BookingWizard';

interface ServiceSelectorProps {
  onSelect: (service: ServiceType, location: LocationType) => void;
}

const services = [
  {
    id: 'v6_hairboost' as ServiceType,
    titleNL: 'V6 Hairboost Consult',
    titleEN: 'V6 Hairboost Consultation',
    descNL: '30 minuten - €50',
    descEN: '30 minutes - €50',
    icon: '💊',
  },
  {
    id: 'haartransplantatie' as ServiceType,
    titleNL: 'Haartransplantatie Consult',
    titleEN: 'Hair Transplant Consultation',
    descNL: '45 minuten - €75',
    descEN: '45 minutes - €75',
    icon: '🏥',
  },
  {
    id: 'ceo_consult' as ServiceType,
    titleNL: 'CEO Consultatie',
    titleEN: 'CEO Consultation',
    descNL: '30 minuten - €500',
    descEN: '30 minutes - €500',
    icon: '👔',
  },
];

export const ServiceSelector = ({ onSelect }: ServiceSelectorProps) => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-light text-white mb-2">
          {language === 'nl' ? 'Kies uw service' : 'Choose your service'}
        </h2>
        <p className="text-white/60 text-sm">
          {language === 'nl' ? 'Selecteer het type consultatie' : 'Select consultation type'}
        </p>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="space-y-3">
            <div 
              className="relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{service.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white">
                    {language === 'nl' ? service.titleNL : service.titleEN}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {language === 'nl' ? service.descNL : service.descEN}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => onSelect(service.id, 'online')}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-white transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  📹 {language === 'nl' ? 'Online' : 'Online'}
                </button>
                <button
                  onClick={() => onSelect(service.id, 'onsite')}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-white transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  🏢 {language === 'nl' ? 'Op locatie' : 'On-site'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
