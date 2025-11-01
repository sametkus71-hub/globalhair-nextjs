import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { CustomerInfo } from './BookingWizard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerInfoFormProps {
  onComplete: (info: CustomerInfo) => void;
  initialData?: CustomerInfo;
}

export const CustomerInfoForm = ({ onComplete, initialData }: CustomerInfoFormProps) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    postcode: initialData?.postcode || '',
    city: initialData?.city || '',
    country: initialData?.country || 'Nederland',
  });

  const countries = [
    'Nederland',
    'Turkije',
    'België',
    'Duitsland',
    'Frankrijk',
    'Spanje',
    'Italië',
    'Verenigd Koninkrijk',
    'Polen',
    'Roemenië',
    'Oostenrijk',
    'Zweden',
    'Denemarken',
    'Finland',
    'Noorwegen',
    'Portugal',
    'Griekenland',
  ];

  const handleChange = (field: keyof typeof formData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    // Auto-validate and pass data up when all required fields are filled
    if (newData.name && newData.email && newData.phone && newData.postcode && newData.city && newData.country) {
      onComplete(newData);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <style>{`
        .floating-label-container {
          position: relative;
        }

        .floating-label {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          white-space: nowrap;
          padding: 0 4px;
          text-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
        }

        .floating-label-container input:focus ~ .floating-label,
        .floating-label-container input:not(:placeholder-shown) ~ .floating-label,
        .floating-label-container textarea:focus ~ .floating-label,
        .floating-label-container textarea:not(:placeholder-shown) ~ .floating-label {
          top: 0;
          transform: translateY(-50%);
          left: 12px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          background: linear-gradient(to bottom, transparent 0%, transparent 40%, #1a1a1a 40%, #1a1a1a 60%, transparent 60%, transparent 100%);
          text-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
        }

        .floating-label-textarea {
          top: 16px;
          transform: none;
        }

        .floating-label-container textarea:focus ~ .floating-label-textarea,
        .floating-label-container textarea:not(:placeholder-shown) ~ .floating-label-textarea {
          top: 0;
          transform: translateY(-50%);
          left: 12px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          background: linear-gradient(to bottom, transparent 0%, transparent 40%, #1a1a1a 40%, #1a1a1a 60%, transparent 60%, transparent 100%);
          text-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
        }
      `}</style>
      
      <div className="space-y-3">
        <h3 
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
          {language === 'nl' ? 'Vul je gegevens in' : 'Fill in your details'}
        </h3>
        
        <div className="floating-label-container">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-3 text-sm rounded bg-[#FFFFFF1F] text-white focus:outline-none font-inter transition-all duration-200"
            placeholder=" "
            required
          />
          <label className="floating-label">
            {language === 'nl' ? 'Naam' : 'Name'}
          </label>
        </div>

        <div className="floating-label-container">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-3 text-sm rounded bg-[#FFFFFF1F] text-white focus:outline-none font-inter transition-all duration-200"
            placeholder=" "
            required
          />
          <label className="floating-label">
            Email
          </label>
        </div>

        <div className="floating-label-container">
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-3 text-sm rounded bg-[#FFFFFF1F] text-white focus:outline-none font-inter transition-all duration-200"
            placeholder=" "
            required
          />
          <label className="floating-label">
            {language === 'nl' ? 'Telefoonnummer' : 'Phone number'}
          </label>
        </div>

        <div className="flex gap-3">
          <div className="floating-label-container" style={{ width: '40%' }}>
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) => handleChange('postcode', e.target.value)}
              className="w-full px-3 py-3 text-sm rounded bg-[#FFFFFF1F] text-white focus:outline-none font-inter transition-all duration-200"
              placeholder=" "
              required
            />
            <label className="floating-label">
              {language === 'nl' ? 'Postcode' : 'Zipcode'}
            </label>
          </div>

          <div className="floating-label-container" style={{ width: '60%' }}>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3 py-3 text-sm rounded bg-[#FFFFFF1F] text-white focus:outline-none font-inter transition-all duration-200"
              placeholder=" "
              required
            />
            <label className="floating-label">
              {language === 'nl' ? 'Plaats' : 'City'}
            </label>
          </div>
        </div>

        <div className="relative">
          <Select
            value={formData.country}
            onValueChange={(value) => handleChange('country', value)}
          >
            <SelectTrigger className="w-full px-3 py-3 text-sm rounded bg-[#FFFFFF1F] text-white focus:outline-none font-inter border-0">
              <SelectValue placeholder={language === 'nl' ? 'Selecteer land' : 'Select country'} />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
              {countries.map((country) => (
                <SelectItem 
                  key={country} 
                  value={country}
                  className="focus:bg-white/10 focus:text-white cursor-pointer py-3"
                >
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.country && (
            <label className="absolute left-[12px] top-0 transform -translate-y-1/2 text-[11px] text-white/70 pointer-events-none font-inter px-1" style={{ textShadow: '0 0 8px rgba(0, 0, 0, 0.5)', background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, #1a1a1a 40%, #1a1a1a 60%, transparent 60%, transparent 100%)' }}>
              {language === 'nl' ? 'Land' : 'Country'}
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
