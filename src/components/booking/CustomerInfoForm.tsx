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
    notes: '',
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    // Auto-validate and pass data up when all required fields are filled
    if (newData.name && newData.email && newData.phone) {
      onComplete(newData);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">
          {language === 'nl' ? 'Uw gegevens' : 'Your details'}
        </h3>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">
            {language === 'nl' ? 'Naam' : 'Name'} *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={language === 'nl' ? 'Uw naam' : 'Your name'}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">
            {language === 'nl' ? 'E-mail' : 'Email'} *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={language === 'nl' ? 'uw@email.nl' : 'your@email.com'}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">
            {language === 'nl' ? 'Telefoon' : 'Phone'} *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={language === 'nl' ? '+31 6 12345678' : '+31 6 12345678'}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">
            {language === 'nl' ? 'Opmerkingen (optioneel)' : 'Notes (optional)'}
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
            placeholder={language === 'nl' ? 'Aanvullende informatie...' : 'Additional information...'}
          />
        </div>
      </div>
    </div>
  );
};