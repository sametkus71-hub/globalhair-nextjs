import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { CustomerInfo } from './BookingWizard';

interface CustomerInfoFormProps {
  onComplete: (info: CustomerInfo) => void;
}

export const CustomerInfoForm = ({ onComplete }: CustomerInfoFormProps) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    city: '',
    country: 'Nederland',
    notes: '',
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    // Auto-validate and pass data up when all required fields are filled
    if (newData.name && newData.email && newData.phone && newData.postcode && newData.city && newData.country) {
      onComplete(newData);
    }
  };

  return (
    <div className="flex flex-col space-y-3 py-4">
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
          color: rgba(255, 255, 255, 0.5);
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
          top: 100%;
          transform: translateY(-50%);
          left: 12px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          text-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
        }

        .floating-label-textarea {
          top: 16px;
          transform: none;
        }

        .floating-label-container textarea:focus ~ .floating-label-textarea,
        .floating-label-container textarea:not(:placeholder-shown) ~ .floating-label-textarea {
          top: 100%;
          transform: translateY(-50%);
          left: 12px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
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

        <div className="floating-label-container">
          <input
            type="text"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full px-3 py-3 text-sm rounded bg-[#FFFFFF1F] text-white focus:outline-none font-inter transition-all duration-200"
            placeholder=" "
            required
          />
          <label className="floating-label">
            {language === 'nl' ? 'Land' : 'Country'}
          </label>
        </div>

        <div className="floating-label-container">
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-3 text-sm rounded bg-[#FFFFFF1F] text-white focus:outline-none resize-none font-inter transition-all duration-200"
            rows={2}
            placeholder=" "
          />
          <label className="floating-label floating-label-textarea">
            {language === 'nl' ? 'Opmerkingen (optioneel)' : 'Notes (optional)'}
          </label>
        </div>
      </div>
    </div>
  );
};
