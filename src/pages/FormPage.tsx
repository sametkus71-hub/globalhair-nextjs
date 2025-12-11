import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { useTranslation } from '@/lib/translations';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const FormPage = () => {
  const { language } = useLanguage();
  const { profile } = useSession();
  const { t } = useTranslation(language);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    concerns: '',
    goals: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, profile });
    // Here you would typically send the data to your backend
    alert(language === 'nl' ? 'Bedankt! We nemen binnenkort contact met u op.' : 'Thank you! We will contact you soon.');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <SEOHead 
        title={language === 'nl' ? 'Gepersonaliseerde Haaranalyse' : 'Personalized Hair Analysis'} 
        description={language === 'nl' ? 'Ontvang een op maat gemaakte behandelingsadvies bij GlobalHair Institute.' : 'Receive customized treatment advice at GlobalHair Institute.'} 
      />
      <div className="min-h-[var(--app-height)] bg-gradient-hero">
        {/* Navigation */}
        <nav className="p-6 border-b border-gray-200">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="font-header text-2xl font-bold text-primary">
              GlobalHair
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              ← {language === 'nl' ? 'Terug' : 'Back'}
            </Button>
          </div>
        </nav>

        <div className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-header font-bold text-gray-800 mb-4">
                {language === 'nl' ? 'Gepersonaliseerde Haaranalyse' : 'Personalized Hair Analysis'}
              </h1>
              <p className="text-xl text-gray-600">
                {language === 'nl' 
                  ? 'Ontvang een op maat gemaakte behandelingsadvies gebaseerd op uw profiel'
                  : 'Receive customized treatment advice based on your profile'
                }
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Summary */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="font-header">
                    {language === 'nl' ? 'Uw Profiel' : 'Your Profile'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'nl' 
                      ? 'Gebaseerd op uw eerdere selecties'
                      : 'Based on your previous selections'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'nl' ? 'Geslacht:' : 'Gender:'}</span>
                    <span className="font-semibold">{profile.geslacht}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'nl' ? 'Haartype:' : 'Hair Type:'}</span>
                    <span className="font-semibold">{profile.haartype}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'nl' ? 'Haarkleur:' : 'Hair Color:'}</span>
                    <span className="font-semibold">{profile.haarkleur}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Form */}
              <Card className="lg:col-span-2 shadow-soft">
                <CardHeader>
                  <CardTitle className="font-header">
                    {language === 'nl' ? 'Aanvullende Informatie' : 'Additional Information'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'nl' 
                      ? 'Vertel ons meer over uw wensen en zorgen'
                      : 'Tell us more about your needs and concerns'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="font-body">
                          {language === 'nl' ? 'Volledige Naam' : 'Full Name'}
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="font-body">
                          {language === 'nl' ? 'E-mailadres' : 'Email Address'}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="font-body">
                        {language === 'nl' ? 'Telefoonnummer' : 'Phone Number'}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="concerns" className="font-body">
                        {language === 'nl' ? 'Haarproblemen/zorgen' : 'Hair Problems/Concerns'}
                      </Label>
                      <Textarea
                        id="concerns"
                        required
                        value={formData.concerns}
                        onChange={(e) => handleInputChange('concerns', e.target.value)}
                        placeholder={language === 'nl' 
                          ? 'Beschrijf uw huidige haarproblemen...'
                          : 'Describe your current hair problems...'
                        }
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="goals" className="font-body">
                        {language === 'nl' ? 'Gewenste resultaten' : 'Desired Results'}
                      </Label>
                      <Textarea
                        id="goals"
                        required
                        value={formData.goals}
                        onChange={(e) => handleInputChange('goals', e.target.value)}
                        placeholder={language === 'nl' 
                          ? 'Wat hoopt u te bereiken met de behandeling?'
                          : 'What do you hope to achieve with the treatment?'
                        }
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full font-header bg-gradient-primary"
                    >
                      {language === 'nl' ? 'Verstuur Analyse Aanvraag' : 'Submit Analysis Request'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <Card className="mt-8 shadow-soft bg-gradient-secondary text-white">
              <CardContent className="p-8 text-center">
                <h3 className="font-header text-2xl font-bold mb-4">
                  {language === 'nl' ? 'Wat gebeurt er nu?' : 'What happens next?'}
                </h3>
                <p className="text-lg">
                  {language === 'nl' 
                    ? 'Onze experts analyseren uw profiel en nemen binnen 24 uur contact met u op voor een persoonlijk behandelingsadvies.'
                    : 'Our experts will analyze your profile and contact you within 24 hours for personalized treatment advice.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormPage;