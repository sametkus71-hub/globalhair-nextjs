import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Award, Users, Clock } from 'lucide-react';

export const TreatmentInfoSection: React.FC = () => {
  const { language } = useLanguage();

  const benefits = [
    {
      icon: Award,
      title: language === 'nl' ? 'Ervaren specialisten' : 'Experienced specialists',
      description: language === 'nl' 
        ? 'Onze artsen hebben meer dan 15 jaar ervaring in haartransplantatie'
        : 'Our doctors have over 15 years of experience in hair transplantation'
    },
    {
      icon: Users,
      title: language === 'nl' ? '10.000+ tevreden patiënten' : '10,000+ satisfied patients',
      description: language === 'nl'
        ? 'Duizenden succesvolle behandelingen met uitstekende resultaten'
        : 'Thousands of successful treatments with excellent results'
    },
    {
      icon: Clock,
      title: language === 'nl' ? 'Snelle herstelperiode' : 'Fast recovery period',
      description: language === 'nl'
        ? 'Moderne technieken zorgen voor minimale downtime'
        : 'Modern techniques ensure minimal downtime'
    }
  ];

  const features = [
    language === 'nl' ? 'FUE (Follicular Unit Extraction) techniek' : 'FUE (Follicular Unit Extraction) technique',
    language === 'nl' ? 'Natuurlijke haargroeimpatronen' : 'Natural hair growth patterns',
    language === 'nl' ? 'Permanente resultaten' : 'Permanent results',
    language === 'nl' ? 'Minimaal litteken' : 'Minimal scarring',
    language === 'nl' ? 'Lokale verdoving' : 'Local anesthesia',
    language === 'nl' ? 'Nazorg en follow-up' : 'Aftercare and follow-up'
  ];

  return (
    <section 
      className="min-h-[var(--app-height)] bg-gradient-to-b from-background to-muted/20 pt-16"
      data-scroll-target="treatment-info"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {language === 'nl' ? 'Waarom kiezen voor GlobalHair?' : 'Why choose GlobalHair?'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'nl' 
              ? 'Ontdek waarom wij de eerste keuze zijn voor haartransplantatie in Europa'
              : 'Discover why we are the first choice for hair transplantation in Europe'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-card rounded-lg p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">
            {language === 'nl' ? 'Onze behandeling kenmerken' : 'Our treatment features'}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-6">
            {language === 'nl' 
              ? 'Klaar om de eerste stap te zetten naar uw nieuwe uitstraling?'
              : 'Ready to take the first step towards your new appearance?'
            }
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors">
            {language === 'nl' ? 'Plan uw gratis consultatie' : 'Plan your free consultation'}
          </button>
        </div>
      </div>
    </section>
  );
};