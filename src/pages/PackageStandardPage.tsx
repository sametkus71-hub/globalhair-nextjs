import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import chevronRightSvg from '@/assets/chevron-right.svg';
import leafSvg from '@/assets/leaf.svg';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';
import { PopupCloseButton, usePopupClose, SwipeablePopupWrapper } from '@/components/PopupCloseButton';
import Hls from 'hls.js';

type FeatureKey = 'fue' | 'comfort' | 'followup' | 'support' | 'precision' | 'stemcell' | 'prime' | 'recovery' | 'anesthesia' | 'biotine' | 'shampoo' | 'washes' | 'followup2' | 'stemcellrepair' | 'v6prime' | 'v6recovery';

export const PackageStandardPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { country: urlCountry, tier: urlTier } = useParams<{ country: string; tier: string }>();
  
  // Always default to Nederland (nl) when popup opens
  const [activeCountry, setActiveCountry] = useState<'nl' | 'tr'>('nl');
  const [activeTier, setActiveTier] = useState<'Standard' | 'Premium' | 'Advanced'>(
    urlTier ? (urlTier.charAt(0).toUpperCase() + urlTier.slice(1)) as 'Standard' | 'Premium' | 'Advanced' : 'Standard'
  );
  const [isExiting, setIsExiting] = useState(false);
  const [openFeatures, setOpenFeatures] = useState<Set<FeatureKey>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { handlePopupClose } = usePopupClose();

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Video sources mapping - same as package cards
  const videoSources = {
    Standard: 'https://vz-104aba77-1e1.b-cdn.net/f360538a-73d6-4b0b-a2bc-c2f735dfb82a/playlist.m3u8',
    Premium: 'https://vz-104aba77-1e1.b-cdn.net/c7fe692c-a489-4911-8363-9eee6efeff85/playlist.m3u8',
    Advanced: 'https://vz-104aba77-1e1.b-cdn.net/3c893e3d-e19b-4543-8ed9-08a86fe43a67/playlist.m3u8'
  };

  // Ensure base page assets are preloaded and mark body as popup-open
  useEffect(() => {
    // Mark popup-open to hide header immediately on mount and during initial direct loads
    if (typeof document !== 'undefined') document.body.classList.add('popup-open');

    const assetsToPreload = [
      '/assets/head-rotation.mp4',
      '/assets/placeholder-head.png',
      '/assets/logo-header.png'
    ];

    assetsToPreload.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      if (asset.endsWith('.mp4')) {
        link.as = 'video';
        link.type = 'video/mp4';
      } else if (asset.endsWith('.png') || asset.endsWith('.jpg')) {
        link.as = 'image';
      }
      
      link.href = asset;
      document.head.appendChild(link);
    });

    return () => {
      if (typeof document !== 'undefined') document.body.classList.remove('popup-open');
    };
  }, []);

  // Load video based on active tier
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const videoUrl = videoSources[activeTier];

    // Clean up existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: false,
        backBufferLength: 90
      });

      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play().catch(() => {
          // Autoplay might be blocked, that's ok
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
      });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      videoElement.src = videoUrl;
      videoElement.addEventListener('loadeddata', () => {
        videoElement.play().catch(() => {
          // Autoplay might be blocked, that's ok
        });
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeTier]);

  // Sync tier from URL when params change (country always stays 'nl' by default)
  useEffect(() => {
    if (urlTier) {
      const normalizedTier = (urlTier.charAt(0).toUpperCase() + urlTier.slice(1)) as 'Standard' | 'Premium' | 'Advanced';
      setActiveTier(normalizedTier);
    }
  }, [urlTier]);

  // Reset to Premium if switching to Turkey while Advanced is selected
  const handleCountryChange = (country: 'nl' | 'tr') => {
    setIsTransitioning(true);
    setTimeout(() => {
      const newTier = country === 'tr' && activeTier === 'Advanced' ? 'Premium' : activeTier;
      const basePath = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
      navigate(`${basePath}/${country}/${newTier.toLowerCase()}`);
      setActiveCountry(country);
      setActiveTier(newTier);
      setIsTransitioning(false);
    }, 150);
  };

  const handleTierChange = (tier: 'Standard' | 'Premium' | 'Advanced') => {
    setIsTransitioning(true);
    setTimeout(() => {
      const basePath = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
      navigate(`${basePath}/${activeCountry}/${tier.toLowerCase()}`);
      setActiveTier(tier);
      setIsTransitioning(false);
    }, 150);
  };

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
      price: '€21.500',
      features: [
        {
          key: 'anesthesia' as FeatureKey,
          title: 'Full Comfort Anesthesia™',
          description: 'Een korte, gecontroleerde narcose die zorgt dat de ingreep volledig pijnloos en ontspannen verloopt. Ideaal voor wie het hoogste niveau van comfort en rust wil tijdens de behandeling.',
          exclusive: true
        },
        {
          key: 'biotine' as FeatureKey,
          title: '1 Year Biotine Cure™',
          description: 'Een kuur van 12 potjes met onze eigen formule, rijk aan biotine en essentiële voedingsstoffen. Ontwikkeld om de haargroei van binnenuit te versterken en het resultaat van de behandeling langdurig te ondersteunen.',
          exclusive: true
        },
        {
          key: 'shampoo' as FeatureKey,
          title: '1 Year Shampoo Care',
          description: 'Een set van 6 flessen shampoo uit onze eigen formule, speciaal ontwikkeld om de hoofdhuid te kalmeren en de haargroei te stimuleren. Zorgt voor gezonde, sterke haren en ondersteunt het herstel na de behandeling.',
          exclusive: true
        },
        {
          key: 'washes' as FeatureKey,
          title: '2 Washes',
          description: 'Twee professionele wassingen op locatie, kort na de behandeling. Uitgevoerd door onze specialisten om de hoofdhuid te reinigen en complicaties te minimaliseren voor een veilig en optimaal herstel.',
          exclusive: true
        },
        {
          key: 'followup2' as FeatureKey,
          title: '2 Personal Follow-Ups',
          description: 'Twee persoonlijke check-ups in onze kliniek in Barendrecht, uitgevoerd door een tricholoog. We volgen je herstel en haargroei nauwgezet op — voor maximale controle en het beste eindresultaat.',
          exclusive: true
        },
        {
          key: 'fue' as FeatureKey,
          title: 'FUE Saffier / DHI',
          description: 'FUE Saffier is de standaard in haartransplantatie: met ultradunne saffieren mesjes voor nauwkeurige plaatsing, minimale littekens en sneller herstel. DHI maakt directe implantatie mogelijk - zonder scheren, met maximale controle over richting en dichtheid.',
          exclusive: false
        },
        {
          key: 'stemcellrepair' as FeatureKey,
          title: 'GHI Stemcell Repair™',
          description: 'Een stamceltherapie, exclusief ontwikkeld en uitgevoerd door GlobalHair Institute. We oogsten lichaamseigen stamcellen om beschadigde haarzakjes te herstellen en het transplantatiegebied te versterken - wat resulteert in 20-35% meer dichtheid en langdurige stabiliteit.',
          exclusive: false
        },
        {
          key: 'v6prime' as FeatureKey,
          title: 'V6 Hairboost® – Prime',
          description: 'Twee voorbehandelingen die het donorgebied versterken en de haarwortels activeren. Hierdoor kan er meer veilig geoogst worden en blijft het donorgebied vol, gezond en vrijwel onzichtbaar behandeld.',
          exclusive: false
        },
        {
          key: 'v6recovery' as FeatureKey,
          title: 'V6 Hairboost® – Recovery',
          description: 'Acht nabehandelingen die het herstel tot twee keer sneller maken. Dankzij onze exclusieve vitaminekuur stimuleert dit het groeiproces - waardoor je na 6 maanden al het resultaat ziet dat normaal pas na 12 maanden optreedt.',
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
    }
  };

  const currentPackage = packageData[activeTier];
  const features = currentPackage.features;

  const getCurrentPrice = () => {
    if (activeCountry === 'tr') {
      switch (activeTier) {
        case 'Standard':
          return '€6.500';
        case 'Premium':
          return '€13.000';
        default:
          return currentPackage.price;
      }
    }
    return currentPackage.price;
  };

  const getSectionBorderGradient = () => {
    switch (activeTier) {
      case 'Standard':
        return 'linear-gradient(#040E15, #333D46), linear-gradient(180deg, #4B555E 0%, #ACB9C1 15%, #FFFFFF 50%, #ACB9C1 85%, #4B555E 100%)';
      case 'Premium':
        return 'linear-gradient(#040E15, #2D3E50), linear-gradient(180deg, #4B555E 0%, #ACB9C1 15%, #E0E8FF 50%, #ACB9C1 85%, #4B555E 100%)';
      case 'Advanced':
        return 'linear-gradient(#0A1628, #1E3A5F), linear-gradient(180deg, #5B7A9E 0%, #B0C4DE 15%, #E6F0FF 50%, #B0C4DE 85%, #5B7A9E 100%)';
      default:
        return 'linear-gradient(#040E15, #333D46), linear-gradient(180deg, #4B555E 0%, #ACB9C1 15%, #FFFFFF 50%, #ACB9C1 85%, #4B555E 100%)';
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(350);
  };

  return (
    <>
      <div
        className={`reviews-page-fullscreen ${isExiting ? 'reviews-page-exit' : ''}`}
        style={{
          overflow: 'hidden',
          position: 'fixed',
          inset: 0,
          zIndex: 30,
          opacity: isTransitioning ? 0.7 : 1,
          transition: 'opacity 0.6s ease-in-out'
        }}
      >
        {/* Background Video - No overlays */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            pointerEvents: 'none',
          }}
        />
        <div 
          className="h-full flex items-start justify-center p-4 pt-4"
        >
          <main className="flex flex-col w-full max-w-2xl h-[calc(100vh-32px)]">
            <SwipeablePopupWrapper onClose={handleClose} className="h-full">
              <section
                className="relative rounded-[24px] p-4 pb-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-[90%] flex flex-col"
                style={{ 
                  border: '1px solid transparent',
                  backgroundImage: getSectionBorderGradient(),
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                  opacity: isTransitioning ? 0.7 : 1,
                  transition: 'opacity 0.3s ease-in-out'
                }}
              >
              {/* Close button inside section */}
              <PopupCloseButton onClose={handleClose} className="absolute top-4 left-4 z-10" />

        {/* Country toggle */}
        <div 
          className="flex gap-0 justify-center mt-8 mb-1.5 mx-auto max-w-[220px] border border-white/20"
          role="tablist" 
          aria-label="Country"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            padding: '3px',
          }}
        >
          <button 
            className={`flex-1 px-3 rounded-full text-[10px] font-light transition-all duration-300 ease-out ${
              activeCountry === 'nl' 
                ? 'silver-gradient-border bg-white/10 text-white scale-105' 
                : 'bg-transparent text-white/50 hover:text-white/70 scale-100'
            }`}
            style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
            onClick={() => handleCountryChange('nl')}
          >
            Nederland
          </button>
          <button 
            className={`flex-1 px-3 rounded-full text-[10px] font-light transition-all duration-300 ease-out ${
              activeCountry === 'tr' 
                ? 'silver-gradient-border bg-white/10 text-white scale-105' 
                : 'bg-transparent text-white/50 hover:text-white/70 scale-100'
            }`}
            style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
            onClick={() => handleCountryChange('tr')}
          >
            Turkije
          </button>
        </div>

        {/* Tier pill */}
        <div 
          className="relative mx-auto my-1.5 max-w-[420px] border border-white/20"
          aria-label="Tiers"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            padding: '5px',
          }}
        >
          <div className={`grid gap-1 ${activeCountry === 'nl' ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <button
              className={`relative text-center px-4 py-2 rounded-full text-sm font-light transition-all duration-300 ease-out ${
                activeTier === 'Standard'
                  ? 'silver-gradient-border bg-white/10 text-white scale-105'
                  : 'bg-transparent text-white/50 hover:text-white/70 scale-100'
              }`}
              onClick={() => handleTierChange('Standard')}
            >
              Standard
            </button>
            <button
              className={`relative text-center px-4 py-2 rounded-full text-sm font-light transition-all duration-300 ease-out ${
                activeTier === 'Premium'
                  ? 'silver-gradient-border bg-white/10 text-white scale-105'
                  : 'bg-transparent text-white/50 hover:text-white/70 scale-100'
              }`}
              onClick={() => handleTierChange('Premium')}
            >
              Premium
            </button>
            {activeCountry === 'nl' && (
              <button
                className={`relative text-center px-4 py-2 rounded-full text-sm font-light transition-all duration-300 ease-out ${
                  activeTier === 'Advanced'
                    ? 'silver-gradient-border bg-white/10 text-white scale-105'
                    : 'bg-transparent text-white/50 hover:text-white/70 scale-100'
                }`}
                onClick={() => handleTierChange('Advanced')}
              >
                Advanced
              </button>
            )}
          </div>
        </div>

        {/* Chips row */}
        <div className="flex gap-2 items-center my-2 px-1">
          <div
            className="silver-grey-gradient-border flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%)',
              padding: '.5rem',
              borderRadius: '.4rem',
            }}
          >
            <img src={chevronRightSvg} alt="" style={{ width: '.8rem', height: '.8rem' }} />
            {activeTier === 'Premium' && (
              <img 
                src={chevronRightSvg} 
                alt="" 
                className="animate-fade-in"
                style={{ 
                  width: '.8rem', 
                  height: '.8rem', 
                  marginLeft: '-4px',
                  animationDelay: '50ms',
                  animationFillMode: 'backwards'
                }} 
              />
            )}
            {activeTier === 'Advanced' && (
              <img 
                src={chevronRightSvg} 
                alt="" 
                className="animate-fade-in"
                style={{ 
                  width: '.8rem', 
                  height: '.8rem', 
                  marginLeft: '-4px',
                  animationDelay: '50ms',
                  animationFillMode: 'backwards'
                }} 
              />
            )}
          </div>
          <div
            className="silver-grey-gradient-border flex items-center justify-center gap-1"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%)',
              padding: '.5rem',
              borderRadius: '.4rem',
            }}
          >
            <img src={leafSvg} alt="" style={{ width: '.8rem', height: '.8rem' }} />
            {activeTier === 'Premium' && (
              <img 
                src={leafSvg} 
                alt="" 
                className="animate-fade-in"
                style={{ 
                  width: '.8rem', 
                  height: '.8rem',
                  animationDelay: '100ms',
                  animationFillMode: 'backwards'
                }} 
              />
            )}
            {activeTier === 'Advanced' && (
              <>
                <img 
                  src={leafSvg} 
                  alt="" 
                  className="animate-fade-in"
                  style={{ 
                    width: '.8rem', 
                    height: '.8rem',
                    animationDelay: '100ms',
                    animationFillMode: 'backwards'
                  }} 
                />
                <img 
                  src={leafSvg} 
                  alt="" 
                  className="animate-fade-in"
                  style={{ 
                    width: '.8rem', 
                    height: '.8rem',
                    animationDelay: '150ms',
                    animationFillMode: 'backwards'
                  }} 
                />
              </>
            )}
          </div>
        </div>

        {/* Scrollable package details */}
        <div className="package-details-scroll flex-1 overflow-y-auto px-1" style={{ minHeight: 0, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Feature accordion */}
          <div className="flex flex-col mt-1">
            {features.map((feature, index) => {
              const isOpen = openFeatures.has(feature.key);
              const isFirstShared = activeTier !== 'Standard' && index > 0 && feature.exclusive === false && features[index - 1]?.exclusive === true;
              const isLastExclusive = activeTier !== 'Standard' && feature.exclusive === true && features[index + 1]?.exclusive === false;
              
              return (
                <div 
                  key={feature.key}
                  className={feature.exclusive ? "animate-fade-in" : ""}
                  style={feature.exclusive ? {
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards'
                  } : {}}
                >
                  {isFirstShared && (
                    <div className="feature-divider border-b border-white/[0.15]" />
                  )}
                  <div className="feature-item">
                    <button
                      className="feature-row flex items-center justify-between py-1.5 w-full text-left"
                      onClick={() => toggleFeature(feature.key)}
                      aria-expanded={isOpen}
                    >
                      <div className="feature-left flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-white/70 flex-shrink-0" strokeWidth={1.5} />
                        <span className="flex items-center gap-2 flex-wrap">
                          {feature.exclusive && (
                            <span 
                              className="text-[8px] px-1.5 py-0.5 rounded-full font-medium"
                              style={{
                                background: activeTier === 'Advanced' 
                                  ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(217, 119, 6, 0.15))'
                                  : 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 193, 7, 0.15))',
                                border: activeTier === 'Advanced'
                                  ? '1px solid rgba(251, 191, 36, 0.3)'
                                  : '1px solid rgba(255, 215, 0, 0.4)',
                                color: activeTier === 'Advanced' ? '#fbbf24' : '#ffd700',
                                boxShadow: activeTier === 'Advanced' ? 'none' : '0 0 8px rgba(255, 215, 0, 0.3)'
                              }}
                            >
                              {activeTier}
                            </span>
                          )}
                          <span className="feature-title text-white text-[12.5px] font-normal">{feature.title}</span>
                        </span>
                      </div>
                      <span className="feature-toggle text-white/60 font-light text-xl leading-none">
                        {isOpen ? '–' : '+'}
                      </span>
                    </button>
                    <div 
                      className="feature-content overflow-hidden transition-all duration-300 ease-in-out"
                      style={{ 
                        maxHeight: isOpen ? '500px' : '0',
                        opacity: isOpen ? 1 : 0,
                        paddingBottom: isOpen ? '0.5rem' : '0'
                      }}
                    >
                      <p className="text-white/80 font-light leading-relaxed" style={{ fontSize: '11px' }}>
                        {feature.description}
                      </p>
                    </div>
                    {!isLastExclusive && <div className="feature-divider border-b border-white/[0.15]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Price pill */}
          <div className="flex justify-end mt-1 mb-1">
            <div className="px-3 py-1 rounded-full text-white text-[13px] backdrop-blur-md transition-all duration-300 animate-scale-in" style={{ background: '#FFFFFF1A', fontWeight: 300 }}>
              {getCurrentPrice()}
            </div>
          </div>
          </div>
        </section>
            </SwipeablePopupWrapper>
      </main>
    </div>
</div>
<FooterCTAGlass />
</>
);
};
