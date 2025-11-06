import { useSession } from '@/hooks/useSession';
import { useLanguage } from '@/hooks/useLanguage';
import { calculatePrice, formatPrice } from '@/lib/pricing';
import { ShieldIcon } from '@/components/logos/ShieldIcon';
import { Check, Star, Zap, Heart } from 'lucide-react';

export const PackageDetailContent = () => {
  const { language } = useLanguage();
  const { profile } = useSession();
  const totalPrice = calculatePrice(profile);

  const packageDetails = {
    Standard: {
      nl: {
        title: 'Standard Pakket',
        subtitle: 'Basis haartransplantatie met bewezen technieken',
        features: [
          { name: 'FUE Saffier techniek', description: 'Geavanceerde haartransplantatie methode' },
          { name: 'GHI Precision Method™', description: 'Onze gepatenteerde precisie methode' },
          { name: '1 Jaar persoonlijke nazorg', description: 'Complete begeleiding gedurende het hele proces' },
          { name: 'Natuurlijke haargroei', description: 'Resultaten die er natuurlijk uitzien' }
        ],
        benefits: ['Bewezen effectiviteit', 'Professionele uitvoering', 'Langdurige resultaten'],
        ideal: 'Perfect voor eerste haartransplantaties en kleinere kaalheid.'
      },
      en: {
        title: 'Standard Package',
        subtitle: 'Basic hair transplant with proven techniques',
        features: [
          { name: 'FUE Sapphire technique', description: 'Advanced hair transplantation method' },
          { name: 'GHI Precision Method™', description: 'Our patented precision method' },
          { name: '1 Year personal aftercare', description: 'Complete guidance throughout the entire process' },
          { name: 'Natural hair growth', description: 'Results that look natural' }
        ],
        benefits: ['Proven effectiveness', 'Professional execution', 'Long-lasting results'],
        ideal: 'Perfect for first hair transplants and minor baldness.'
      }
    },
    Premium: {
      nl: {
        title: 'Premium Pakket',
        subtitle: 'Geavanceerde behandeling met sneller herstel',
        features: [
          { name: 'FUE Saffier / DHI techniek', description: 'Keuze uit de beste technieken' },
          { name: 'Comfort Verdoving', description: 'Minimale pijn tijdens de behandeling' },
          { name: 'V6 Hairboost® Pre-Treatment', description: 'Voorbereiding voor optimale resultaten' },
          { name: 'V6 Hairboost® 1 Jaar Abonnement', description: 'Doorlopende haarversterking' },
          { name: 'GHI Precision Method™', description: 'Onze gepatenteerde precisie methode' },
          { name: '1 Jaar persoonlijke nazorg', description: 'Uitgebreide begeleiding' }
        ],
        benefits: ['2x sneller herstel', 'Meer dichtheid', 'Betere haargroei'],
        ideal: 'Ideaal voor wie sneller wil herstellen en maximale dichtheid wil.'
      },
      en: {
        title: 'Premium Package',
        subtitle: 'Advanced treatment with faster recovery',
        features: [
          { name: 'FUE Sapphire / DHI technique', description: 'Choice of the best techniques' },
          { name: 'Comfort Anesthesia', description: 'Minimal pain during treatment' },
          { name: 'V6 Hairboost® Pre-Treatment', description: 'Preparation for optimal results' },
          { name: 'V6 Hairboost® 1 Year Subscription', description: 'Continuous hair strengthening' },
          { name: 'GHI Precision Method™', description: 'Our patented precision method' },
          { name: '1 Year personal aftercare', description: 'Extensive guidance' }
        ],
        benefits: ['2x faster recovery', 'More density', 'Better hair growth'],
        ideal: 'Ideal for those who want to recover faster and achieve maximum density.'
      }
    },
    Elite: {
      nl: {
        title: 'Elite Pakket',
        subtitle: 'Het meest geavanceerde pakket met stamceltherapie',
        features: [
          { name: 'FUE Saffier / DHI techniek', description: 'Beste beschikbare technieken' },
          { name: 'GHI Stemcell Repair™', description: 'Revolutionaire stamceltherapie' },
          { name: 'Comfort Verdoving', description: 'Volledig pijnloze behandeling' },
          { name: 'V6 Hairboost® Pre-Treatment', description: 'Optimale voorbereiding' },
          { name: 'V6 Hairboost® 1 Jaar Abonnement', description: 'Maximale haarversterking' },
          { name: 'GHI Precision Method™', description: 'Onze gepatenteerde precisie methode' },
          { name: '1 Jaar persoonlijke nazorg', description: 'VIP begeleiding' }
        ],
        benefits: ['Stamcel regeneratie', 'Maximale dichtheid', 'Uitzonderlijke resultaten'],
        ideal: 'Voor wie het beste van het beste wil en maximale resultaten nastreeft.'
      },
      en: {
        title: 'Elite Package',
        subtitle: 'The most advanced package with stem cell therapy',
        features: [
          { name: 'FUE Sapphire / DHI technique', description: 'Best available techniques' },
          { name: 'GHI Stemcell Repair™', description: 'Revolutionary stem cell therapy' },
          { name: 'Comfort Anesthesia', description: 'Completely painless treatment' },
          { name: 'V6 Hairboost® Pre-Treatment', description: 'Optimal preparation' },
          { name: 'V6 Hairboost® 1 Year Subscription', description: 'Maximum hair strengthening' },
          { name: 'GHI Precision Method™', description: 'Our patented precision method' },
          { name: '1 Year personal aftercare', description: 'VIP guidance' }
        ],
        benefits: ['Stem cell regeneration', 'Maximum density', 'Exceptional results'],
        ideal: 'For those who want the best of the best and strive for maximum results.'
      }
    }
  };

  const currentPackage = packageDetails[profile.selectedPackage as keyof typeof packageDetails];
  const content = currentPackage[language as keyof typeof currentPackage];

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      {/* Package Header */}
      <div className="text-center mb-8">
        <h2 className="font-lato text-[24px] font-bold text-white mb-2">
          {content.title}
        </h2>
        <p className="font-lato text-[14px] text-white/80 mb-4">
          {content.subtitle}
        </p>
        <div className="inline-block px-6 py-3 rounded-full" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p className="font-lato text-[18px] font-bold text-white">
            {formatPrice(totalPrice)}
          </p>
        </div>
      </div>

      {/* Features List */}
      <div className="mb-8">
        <h3 className="font-lato text-[18px] font-semibold text-white mb-4 text-center">
          {language === 'nl' ? 'Inbegrepen in dit pakket:' : 'Included in this package:'}
        </h3>
        <div className="space-y-4">
          {content.features.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-start space-x-3 p-4 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="w-6 h-6 flex-shrink-0 mt-1">
                <ShieldIcon className="w-full h-full [&_.cls-1]:fill-white" />
              </div>
              <div>
                <h4 className="font-lato text-[14px] font-semibold text-white mb-1">
                  {feature.name}
                </h4>
                <p className="font-lato text-[12px] text-white/80">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-8">
        <h3 className="font-lato text-[18px] font-semibold text-white mb-4 text-center">
          {language === 'nl' ? 'Voordelen:' : 'Benefits:'}
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {content.benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Check className="w-4 h-4 text-green-400" />
              <span className="font-lato text-[12px] text-white">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ideal For */}
      <div className="text-center">
        <div 
          className="inline-block p-4 rounded-lg max-w-md"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <h4 className="font-lato text-[14px] font-semibold text-white mb-2">
            {language === 'nl' ? 'Ideaal voor:' : 'Ideal for:'}
          </h4>
          <p className="font-lato text-[12px] text-white/80">
            {content.ideal}
          </p>
        </div>
      </div>
    </div>
  );
};