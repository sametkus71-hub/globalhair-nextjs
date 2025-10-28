import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CustomerInfo } from './BookingWizard';

interface CustomerInfoFormProps {
  onComplete: (info: CustomerInfo) => void;
  onBack: () => void;
}

export const CustomerInfoForm = ({ onComplete, onBack }: CustomerInfoFormProps) => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error(language === 'nl' ? 'Vul alle verplichte velden in' : 'Please fill in all required fields');
      return;
    }

    // Pass data back to parent
    onComplete(formData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === 'nl' ? 'Terug' : 'Back'}
        </button>
      </div>

      <div className="flex-1 px-4 pb-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {language === 'nl' ? 'Jouw gegevens' : 'Your information'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              {language === 'nl' ? 'Naam' : 'Name'} *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              {language === 'nl' ? 'E-mail' : 'Email'} *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              {language === 'nl' ? 'Telefoonnummer' : 'Phone number'} *
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              {language === 'nl' ? 'Opmerkingen (optioneel)' : 'Notes (optional)'}
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-white/20 hover:bg-white/30 text-white"
          >
            {language === 'nl' ? 'Verder naar betaling' : 'Continue to payment'}
          </Button>
        </form>
      </div>
    </div>
  );
};
