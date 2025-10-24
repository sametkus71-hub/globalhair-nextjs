import { useState } from 'react';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import chevronRightSvg from '@/assets/chevron-right.svg';
import leafSvg from '@/assets/leaf.svg';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';

type FeatureKey = 'fue' | 'comfort' | 'followup' | 'support' | 'precision' | 'stemcell' | 'prime' | 'recovery';

export const PackageStandardPage = () => {
  const { language } = useLanguage();
  const [activeCountry, setActiveCountry] = useState<'nl' | 'tr'>('nl');
  const [activeTier, setActiveTier] = useState<'Standard' | 'Premium' | 'Advanced'>('Standard');
  const [isExiting, setIsExiting] = useState(false);
  const [openFeatures, setOpenFeatures] = useState<Set<FeatureKey>>(new Set());
  const { handlePopupClose } = usePopupClose();

  const toggleFeature = (key: FeatureKey) => {
    setOpenFeatures(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const packageData = {
    Standard: {
      price: '€8.000',
      features: [
        {
          key: 'fue' as FeatureKey,
          title: 'FUE Saffier / DHI',
          description: 'FUE Saffier is de standaard in haartransplantatie: met ultradunne saffieren mesjes voor nauwkeurige plaatsing, minimale littekens en sneller herstel. DHI maakt directe implantatie mogelijk - zonder scheren, met maximale controle over richting en dichtheid.',
          exclusive: false
        },
        {
          key: 'comfort' as FeatureKey,
          title: 'Comfort verdoving',
          description: 'Een naaldloze verdoving die zonder prikken wordt aangebracht. Je voelt nog iets, maar veel minder intens - voor een rustige, comfortabele ervaring zonder scherpe pijn.',
          exclusive: false
        },
        {
          key: 'followup' as FeatureKey,
          title: '1 Personal Follow-Up',
          description: 'Een persoonlijke check-up in onze kliniek in Barendrecht, uitgevoerd door een tricholoog (haarspecialist). Hier wordt je groei, herstel en hoofdhuidconditie gecontroleerd voor een optimale voortgang van het resultaat.',
          exclusive: false
        },
        {
          key: 'support' as FeatureKey,
          title: '1 Year GHI Support™',
          description: 'Een jaar lang persoonlijke begeleiding via WhatsApp of telefoon. Onze specialisten staan klaar om jouw vragen te beantwoorden en je groei van dichtbij te volgen - altijd bereikbaar, altijd persoonlijk.',
          exclusive: false
        },
        {
          key: 'precision' as FeatureKey,
          title: 'GHI Precision Method™',
          description: 'De exclusieve methode van Berkant Dural, waarmee al onze artsen persoonlijk zijn opgeleid. Een unieke werkwijze die ambacht, precisie en rust combineert - zonder tijdsdruk, in perfecte omstandigheden, om elk resultaat tot een meesterwerk in haartransplantatie te maken.',
          exclusive: false
        }
      ]
    },
    Premium: {
      price: '€16.000',
      features: [
        {
          key: 'stemcell' as FeatureKey,
          title: 'GHI Stemcell Repair™',
          description: 'Een stamceltherapie, exclusief ontwikkeld en uitgevoerd door GlobalHair Institute. We oogsten lichaamseigen stamcellen om beschadigde haarzakjes te herstellen en het transplantatiegebied te versterken - wat resulteert in 20-35% meer dichtheid en langdurige stabiliteit.',
          exclusive: true
        },
        {
          key: 'prime' as FeatureKey,
          title: 'V6 Hairboost® - Prime',
          description: 'Twee voorbehandelingen die het donorgebied versterken en de haarwortels activeren. Hierdoor kan er meer veilig geoogst worden en blijft het donorgebied vol, gezond en vrijwel onzichtbaar behandeld.',
          exclusive: true
        },
        {
          key: 'recovery' as FeatureKey,
          title: 'V6 Hairboost® - Recovery',
          description: 'Acht nabehandelingen die het herstel tot twee keer sneller maken. Dankzij onze exclusieve vitaminekuur stimuleert dit het groeiproces - waardoor je na 6 maanden al het resultaat ziet dat normaal pas na 12 maanden optreedt.',
          exclusive: true
        },
        {
          key: 'fue' as FeatureKey,
          title: 'FUE Saffier / DHI',
          description: 'FUE Saffier is de standaard in haartransplantatie: met ultradunne saffieren mesjes voor nauwkeurige plaatsing, minimale littekens en sneller herstel. DHI maakt directe implantatie mogelijk - zonder scheren, met maximale controle over richting en dichtheid.',
          exclusive: false
        },
        {
          key: 'comfort' as FeatureKey,
          title: 'Comfort verdoving',
          description: 'Een naaldloze verdoving die zonder prikken wordt aangebracht. Je voelt nog iets, maar veel minder intens - voor een rustige, comfortabele ervaring zonder scherpe pijn.',
          exclusive: false
        },
        {
          key: 'followup' as FeatureKey,
          title: '1 Personal Follow-Up',
          description: 'Een persoonlijke check-up in onze kliniek in Barendrecht, uitgevoerd door een tricholoog (haarspecialist). Hier wordt je groei, herstel en hoofdhuidconditie gecontroleerd voor een optimale voortgang van het resultaat.',
          exclusive: false
        },
        {
          key: 'support' as FeatureKey,
          title: '1 Year GHI Support™',
          description: 'Een jaar lang persoonlijke begeleiding via WhatsApp of telefoon. Onze specialisten staan klaar om jouw vragen te beantwoorden en je groei van dichtbij te volgen - altijd bereikbaar, altijd persoonlijk.',
          exclusive: false
        },
        {
          key: 'precision' as FeatureKey,
          title: 'GHI Precision Method™',
          description: 'De exclusieve methode van Berkant Dural, waarmee al onze artsen persoonlijk zijn opgeleid. Een unieke werkwijze die ambacht, precisie en rust combineert - zonder tijdsdruk, in perfecte omstandigheden, om elk resultaat tot een meesterwerk in haartransplantatie te maken.',
          exclusive: false
        }
      ]
    },
    Advanced: {
      price: '€24.000',
      features: []
    }
  };

  const currentPackage = packageData[activeTier];
  const features = currentPackage.features;

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(350);
  };

  return (
    <>
      <div
        className={`reviews-page-fullscreen ${isExiting ? 'reviews-page-exit' : ''}`}
        style={{
          background: 'linear-gradient(180deg, #040E15 0%, #333D46 100%)',
          overflow: 'hidden',
          position: 'fixed',
          inset: 0,
          zIndex: 30
        }}
      >
        <div 
          className="h-full flex items-start justify-center p-4 pt-4"
        >
          <main className="flex flex-col w-full max-w-2xl h-[calc(100vh-32px)]">
            <section 
              className="relative rounded-[24px] p-6 pb-8 backdrop-blur-xl bg-gradient-to-b from-[#040E15] to-[#333D46] shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-[90%] flex flex-col"
              style={{ 
                border: '1px solid transparent',
                backgroundImage: 'linear-gradient(#040E15, #333D46), linear-gradient(180deg, #4B555E 0%, #ACB9C1 15%, #FFFFFF 50%, #ACB9C1 85%, #4B555E 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
            >
              {/* Close button inside section */}
              <PopupCloseButton onClose={handleClose} className="absolute top-4 left-4 z-10" />

        {/* Country toggle */}
        <div 
          className="flex gap-0 justify-center mt-6 mb-4 mx-auto max-w-[280px] border border-white/20" 
          role="tablist" 
          aria-label="Country"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            padding: '4px',
          }}
        >
          <button 
            className={`flex-1 px-4 rounded-full text-xs font-light transition-all ${
              activeCountry === 'nl' 
                ? 'silver-gradient-border bg-white/10 text-white' 
                : 'bg-transparent text-white/50 hover:text-white/70'
            }`}
            style={{ paddingTop: '0.675rem', paddingBottom: '0.675rem' }}
            onClick={() => setActiveCountry('nl')}
          >
            Nederland
          </button>
          <button 
            className={`flex-1 px-4 rounded-full text-xs font-light transition-all ${
              activeCountry === 'tr' 
                ? 'silver-gradient-border bg-white/10 text-white' 
                : 'bg-transparent text-white/50 hover:text-white/70'
            }`}
            style={{ paddingTop: '0.675rem', paddingBottom: '0.675rem' }}
            onClick={() => setActiveCountry('tr')}
          >
            Turkije
          </button>
        </div>

        {/* Tier pill */}
        <div 
          className="relative mx-auto my-4 max-w-[360px] border border-white/20" 
          aria-label="Tiers"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            padding: '4px',
          }}
        >
          <div className="grid grid-cols-3 gap-1">
            <button
              className={`relative text-center px-3 py-1.5 rounded-full text-xs font-light transition-all ${
                activeTier === 'Standard'
                  ? 'silver-gradient-border bg-white/10 text-white'
                  : 'bg-transparent text-white/50 hover:text-white/70'
              }`}
              onClick={() => setActiveTier('Standard')}
            >
              Standard
            </button>
            <button
              className={`relative text-center px-3 py-1.5 rounded-full text-xs font-light transition-all ${
                activeTier === 'Premium'
                  ? 'silver-gradient-border bg-white/10 text-white'
                  : 'bg-transparent text-white/50 hover:text-white/70'
              }`}
              onClick={() => setActiveTier('Premium')}
            >
              Premium
            </button>
            <button
              className={`relative text-center px-3 py-1.5 rounded-full text-xs font-light transition-all ${
                activeTier === 'Advanced'
                  ? 'silver-gradient-border bg-white/10 text-white'
                  : 'bg-transparent text-white/50 hover:text-white/70'
              }`}
              onClick={() => setActiveTier('Advanced')}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Chips row */}
        <div className="flex gap-2 items-center my-4 px-1">
          <div
            className="silver-grey-gradient-border flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%)',
              padding: '.5rem',
              borderRadius: '.4rem',
            }}
          >
            <img src={chevronRightSvg} alt="" style={{ width: '.8rem', height: '.8rem' }} />
          </div>
          <div
            className="silver-grey-gradient-border flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%)',
              padding: '.5rem',
              borderRadius: '.4rem',
            }}
          >
            <img src={leafSvg} alt="" style={{ width: '.8rem', height: '.8rem' }} />
          </div>
        </div>

        {/* Scrollable package details */}
        <div className="package-details-scroll flex-1 overflow-y-auto px-1" style={{ minHeight: 0, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Feature accordion */}
          <div className="flex flex-col mt-4">
            {features.map((feature, index) => {
              const isOpen = openFeatures.has(feature.key);
              const isFirstShared = activeTier !== 'Standard' && index > 0 && feature.exclusive === false && features[index - 1]?.exclusive === true;
              
              return (
                <div key={feature.key}>
                  {isFirstShared && (
                    <div className="border-b border-white/[0.15] my-2" />
                  )}
                  <div className="feature-item">
                    <button
                      className="feature-row flex items-center justify-between py-3 w-full text-left"
                      onClick={() => toggleFeature(feature.key)}
                      aria-expanded={isOpen}
                    >
                      <div className="feature-left flex items-center gap-2">
                        <Shield className="w-4 h-4 text-white/70 flex-shrink-0" strokeWidth={1.5} />
                        <span className="flex items-center gap-2 flex-wrap">
                          {feature.exclusive && (
                            <span 
                              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                              style={{
                                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(217, 119, 6, 0.15))',
                                border: '1px solid rgba(251, 191, 36, 0.3)',
                                color: '#fbbf24'
                              }}
                            >
                              {activeTier}
                            </span>
                          )}
                          <span className="feature-title text-white text-sm font-normal">{feature.title}</span>
                        </span>
                      </div>
                      <span className="feature-toggle text-white/60 font-light text-xl leading-none">
                        {isOpen ? '–' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="feature-content pb-3">
                        <p className="text-white/80 font-light leading-relaxed" style={{ fontSize: '12px' }}>
                          {feature.description}
                        </p>
                      </div>
                    )}
                    <div className="feature-divider border-b border-white/[0.15]" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Price pill */}
          <div className="flex justify-end mt-4 mb-2">
            <div className="px-4 py-1.5 rounded-full bg-black/40 border border-white/20 text-white font-medium text-sm backdrop-blur-md">
              {currentPackage.price}
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</div>
<FooterCTAGlass />
</>
);
};
