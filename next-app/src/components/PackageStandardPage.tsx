'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import chevronRightSvg from '@/assets/chevron-right.svg';
import leafSvg from '@/assets/leaf.svg';
import precisionBadge from '@/assets/precision-method-badge.png';
import { PopupCloseButton, usePopupClose, SwipeablePopupWrapper } from '@/components/PopupCloseButton';

// SEO content for each package tier and country combination
const getSEOContent = (country: 'nl' | 'tr', tier: 'Standard' | 'Premium' | 'Elite', language: 'nl' | 'en') => {
  const seoData = {
    nl: {
      Standard: {
        nl: {
          title: 'Standard Haartransplantatie - FUE Saffier & Comfort Verdoving | GlobalHair Institute',
          description: 'Een complete start. Onze Standard haartransplantatie bevat de precieze FUE Saffier methode met Comfort Verdoving voor een natuurlijk en pijnloos resultaat.'
        },
        en: {
          title: 'Standard Hair Transplant - FUE Sapphire & Comfort Anesthesia | GlobalHair Institute',
          description: 'A complete start. Our Standard hair transplant includes the precise FUE Sapphire method with Comfort Anesthesia for a natural and painless result.'
        }
      },
      Premium: {
        nl: {
          title: 'Premium Haartransplantatie - GHI Stemcell Repair™ | GlobalHair Institute',
          description: 'Ons meest gekozen pakket. Combineert FUE Saffier met onze unieke GHI Stemcell Repair™ voor 20-35% meer haardichtheid en sneller herstel.'
        },
        en: {
          title: 'Premium Hair Transplant - GHI Stemcell Repair™ | GlobalHair Institute',
          description: 'Our most chosen package. Combines FUE Sapphire with our unique GHI Stemcell Repair™ for 20-35% more hair density and faster recovery.'
        }
      },
      Elite: {
        nl: {
          title: 'Elite Haartransplantatie - Slaapnarcose & V6 Hairboost® | GlobalHair Institute',
          description: 'De ultieme behandeling. Exclusief inclusief Full Comfort Anesthesia (slaapnarcose) en het volledige V6 Hairboost® traject voor maximaal volume.'
        },
        en: {
          title: 'Elite Hair Transplant - Sleep Anesthesia & V6 Hairboost® | GlobalHair Institute',
          description: 'The ultimate treatment. Exclusively including Full Comfort Anesthesia (sleep anesthesia) and the complete V6 Hairboost® trajectory for maximum volume.'
        }
      }
    },
    tr: {
      Standard: {
        nl: {
          title: 'Standard Haartransplantatie Turkije - FUE Saffier & All-Inclusive | GlobalHair Institute',
          description: 'Bekijk ons Standard pakket in Turkije. FUE Saffier haartransplantatie inclusief 5-sterren verblijf, VIP transfers en Comfort Verdoving.'
        },
        en: {
          title: 'Standard Hair Transplant Turkey - FUE Sapphire & All-Inclusive | GlobalHair Institute',
          description: 'View our Standard package in Turkey. FUE Sapphire hair transplant including 5-star stay, VIP transfers and Comfort Anesthesia.'
        }
      },
      Premium: {
        nl: {
          title: 'Premium Haartransplantatie Turkije - Stemcell Repair™ & VIP | GlobalHair Institute',
          description: 'Luxe en resultaat. Premium haartransplantatie in Turkije met GHI Stemcell Repair™, 5-sterren hotel en volledige ontzorging.'
        },
        en: {
          title: 'Premium Hair Transplant Turkey - Stemcell Repair™ & VIP | GlobalHair Institute',
          description: 'Luxury and results. Premium hair transplant in Turkey with GHI Stemcell Repair™, 5-star hotel and complete care.'
        }
      },
      Elite: {
        nl: {
          title: 'Elite Haartransplantatie - Slaapnarcose & V6 Hairboost® | GlobalHair Institute',
          description: 'Het Elite pakket is exclusief beschikbaar in Nederland voor de hoogste kwaliteit en persoonlijke begeleiding.'
        },
        en: {
          title: 'Elite Hair Transplant - Sleep Anesthesia & V6 Hairboost® | GlobalHair Institute',
          description: 'The Elite package is exclusively available in Netherlands for the highest quality and personal guidance.'
        }
      }
    }
  };

  return seoData[country][tier][language];
};


type FeatureKey = 'fue' | 'comfort' | 'fullcomfort' | 'support' | 'precision' | 'stemcellrepair' | 'v6prime' | 'v6recovery' | 'followup' | 'followup2' | 'biotine' | 'shampoo' | 'washes' | 'indicators';

export const PackageStandardPage = () => {
  const { language } = useLanguage();
  const router = useRouter();
  const { country: urlCountry, tier: urlTier } = useParams<{ country: string; tier: string }>();
  const isMobile = useIsMobile();

  // Always default to Nederland (nl) when popup opens
  const [activeCountry, setActiveCountry] = useState<'nl' | 'tr'>('nl');
  const [activeTier, setActiveTier] = useState<'Standard' | 'Premium' | 'Elite'>(
    urlTier ? (urlTier.charAt(0).toUpperCase() + urlTier.slice(1)) as 'Standard' | 'Premium' | 'Elite' : 'Standard'
  );
  const [isExiting, setIsExiting] = useState(false);
  const [openFeatures, setOpenFeatures] = useState<Set<FeatureKey>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showEliteTooltip, setShowEliteTooltip] = useState(false);
  const { handlePopupClose } = usePopupClose();

  // Check if Turkey should be disabled (Elite is only available in Netherlands)
  const isCountryDisabled = (country: 'nl' | 'tr') => {
    return country === 'tr' && activeTier === 'Elite';
  };

  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Video sources mapping - correct URLs for each tier
  const videoSources = {
    Standard: {
      mobile: 'https://GlobalHair.b-cdn.net/pakketten%20bg%20vid/D%20-%20Standard%20V0.webm',
      desktop: 'https://GlobalHair.b-cdn.net/pakketten%20bg%20vid/P%20-%20Standard%20V0%20(1).webm'
    },
    Premium: {
      mobile: 'https://GlobalHair.b-cdn.net/pakketten%20bg%20vid/D%20-%20Premium%20V0%20(1).webm',
      desktop: 'https://GlobalHair.b-cdn.net/pakketten%20bg%20vid/P%20-%20Premium%20V0%20(1).webm'
    },
    Elite: {
      mobile: 'https://GlobalHair.b-cdn.net/pakketten%20bg%20vid/D%20-%20Elite%20V0%20(1).webm',
      desktop: 'https://GlobalHair.b-cdn.net/pakketten%20bg%20vid/P%20-%20Elite%20V0%20(1).webm'
    }
  };

  const getVideoSource = (tier: 'Standard' | 'Premium' | 'Elite') => {
    return isMobile ? videoSources[tier].mobile : videoSources[tier].desktop;
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

  // Initialize first video on mount
  useEffect(() => {
    if (!videoContainerRef.current) return;

    const initialVideo = document.createElement('video');
    initialVideo.src = getVideoSource(activeTier);
    initialVideo.autoplay = true;
    initialVideo.loop = true;
    initialVideo.muted = true;
    initialVideo.playsInline = true;
    initialVideo.className = 'absolute inset-0 w-full h-full object-cover';
    initialVideo.style.opacity = '1';
    initialVideo.style.zIndex = '0';

    videoContainerRef.current.appendChild(initialVideo);
    initialVideo.load();
    initialVideo.play().catch(() => { });

    return () => {
      if (videoContainerRef.current) {
        videoContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  // Defensive redirect: ensure package URLs always use correct format
  useEffect(() => {
    if (urlCountry && urlCountry !== 'nl' && urlCountry !== 'tr') {
      // Redirect incorrect country codes to canonical Dutch path
      const tier = urlTier || 'standard';
      router.push(`/nl/haartransplantatie/nl/${tier}`);
    }
  }, [urlCountry, urlTier, router]);

  // Sync tier from URL when params change (country always stays 'nl' by default)
  useEffect(() => {
    if (urlTier) {
      const normalizedTier = (urlTier.charAt(0).toUpperCase() + urlTier.slice(1)) as 'Standard' | 'Premium' | 'Elite';
      setActiveTier(normalizedTier);
    }
  }, [urlTier]);

  // Handle click outside to dismiss tooltip
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showEliteTooltip) {
        setShowEliteTooltip(false);
      }
    };

    if (showEliteTooltip) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showEliteTooltip]);

  // Load video dynamically in background for smooth crossfade
  const loadVideoInBackground = (src: string): Promise<HTMLVideoElement> => {
    return new Promise((resolve, reject) => {
      const newVideo = document.createElement('video');
      newVideo.src = src;
      newVideo.autoplay = true;
      newVideo.loop = true;
      newVideo.muted = true;
      newVideo.playsInline = true;
      newVideo.className = 'absolute inset-0 w-full h-full object-cover';
      newVideo.style.opacity = '0';
      newVideo.style.zIndex = '-1';

      newVideo.addEventListener('canplay', () => {
        newVideo.play().then(() => resolve(newVideo)).catch(reject);
      }, { once: true });

      newVideo.addEventListener('error', reject, { once: true });

      newVideo.load();
      videoContainerRef.current?.appendChild(newVideo);
    });
  };

  // Reset to Premium if switching to Turkey while Elite is selected
  const handleCountryChange = async (country: 'nl' | 'tr') => {
    // Prevent switching to Turkey if Elite is selected
    if (country === 'tr' && activeTier === 'Elite') {
      return;
    }

    if (isTransitioning) return;

    setIsTransitioning(true);

    const newTier = country === 'tr' && activeTier === 'Elite' ? 'Premium' : activeTier;
    const basePath = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';

    // Update URL without navigation
    window.history.replaceState(null, '', `${basePath}/${country}/${newTier.toLowerCase()}`);

    // Get current video
    const currentVideo = videoContainerRef.current?.querySelector('video[style*="opacity: 1"]') as HTMLVideoElement;

    try {
      // Load new video in background
      const newVideoSrc = getVideoSource(newTier);
      const newVideo = await loadVideoInBackground(newVideoSrc);

      // Prepare for crossfade
      newVideo.style.zIndex = '0';

      // Start crossfade after short delay
      setTimeout(() => {
        newVideo.style.transition = 'opacity 350ms ease-in-out';
        newVideo.style.opacity = '1';

        if (currentVideo) {
          currentVideo.style.transition = 'opacity 350ms ease-in-out';
          currentVideo.style.opacity = '0';

          setTimeout(() => {
            currentVideo.remove();
          }, 350);
        }
      }, 50);

      // Update content quickly for snappy feel
      setTimeout(() => {
        setActiveCountry(country);
        setActiveTier(newTier);
      }, 50);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    } catch (error) {
      console.error('Video load failed:', error);
      setIsTransitioning(false);
    }
  };

  const handleTierChange = async (tier: 'Standard' | 'Premium' | 'Elite') => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    const basePath = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';

    // Update URL without navigation
    window.history.replaceState(null, '', `${basePath}/${activeCountry}/${tier.toLowerCase()}`);

    // Get current video
    const currentVideo = videoContainerRef.current?.querySelector('video[style*="opacity: 1"]') as HTMLVideoElement;

    try {
      // Load new video in background
      const newVideoSrc = getVideoSource(tier);
      const newVideo = await loadVideoInBackground(newVideoSrc);

      // Prepare for crossfade
      newVideo.style.zIndex = '0';

      // Start crossfade after short delay
      setTimeout(() => {
        newVideo.style.transition = 'opacity 350ms ease-in-out';
        newVideo.style.opacity = '1';

        if (currentVideo) {
          currentVideo.style.transition = 'opacity 350ms ease-in-out';
          currentVideo.style.opacity = '0';

          setTimeout(() => {
            currentVideo.remove();
          }, 350);
        }
      }, 50);

      // Update content quickly for snappy feel
      setTimeout(() => {
        setActiveTier(tier);
      }, 50);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    } catch (error) {
      console.error('Video load failed:', error);
      setIsTransitioning(false);
    }
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
      price: '€7.250',
      features: [
        {
          key: 'indicators' as FeatureKey,
          title: 'Package Indicators',
          description: 'Natuurlijk herstel, zichtbaar resultaat',
          exclusive: false
        },
        {
          key: 'fue' as FeatureKey,
          title: 'FUE Saffier / DHI',
          description: 'FUE Saffier is de standaard in haartransplantatie: met ultradunne saffieren mesjes voor nauwkeurige plaatsing, minimale littekens en sneller herstel. DHI maakt directe implantatie mogelijk zonder scheren, met maximale controle over richting en dichtheid.',
          exclusive: false
        },
        {
          key: 'comfort' as FeatureKey,
          title: 'Comfort Verdoving',
          description: 'Een naaldloze verdoving die zonder prikken wordt aangebracht. Je voelt nog iets, maar veel minder intens. Voor een rustige, comfortabele ervaring zonder scherpe pijn.',
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
          title: '1 Year GHI Support',
          description: 'Een jaar lang persoonlijke begeleiding via WhatsApp of telefoon. Onze specialisten staan klaar om jouw vragen te beantwoorden en je groei van dichtbij te volgen. Altijd bereikbaar, altijd persoonlijk.',
          exclusive: false
        },
        {
          key: 'precision' as FeatureKey,
          title: 'GHI Precision Method™',
          description: 'Een exclusief chirurgisch protocol ontwikkeld en gecertificeerd door Berkant Dural. Het is de methode waarmee al onze artsen & trichologen persoonlijk worden opgeleid om dezelfde hoge standaard en precisie te waarborgen. Een unieke werkwijze die ambacht, detail en rust combineert in perfecte omstandigheden zodat elk resultaat een meesterwerk in haartransplantatie wordt.',
          exclusive: false
        }
      ]
    },
    Premium: {
      price: '€12.950',
      features: [
        {
          key: 'indicators' as FeatureKey,
          title: 'Package Indicators',
          description: 'Recovery x2 sneller\nMeer dichtheid & langdurige groei',
          exclusive: false
        },
        {
          key: 'fue' as FeatureKey,
          title: 'FUE Saffier / DHI',
          description: 'FUE Saffier is de standaard in haartransplantatie: met ultradunne saffieren mesjes voor nauwkeurige plaatsing, minimale littekens en sneller herstel. DHI maakt directe implantatie mogelijk zonder scheren, met maximale controle over richting en dichtheid.',
          exclusive: false
        },
        {
          key: 'stemcellrepair' as FeatureKey,
          title: 'GHI Stemcell Repair™',
          description: 'Een stamceltherapie, exclusief ontwikkeld en uitgevoerd door GlobalHair Institute. We oogsten lichaamseigen stamcellen om beschadigde haarzakjes te herstellen en het transplantatiegebied te versterken, wat resulteert in 20-35% meer dichtheid en langdurige stabiliteit.',
          exclusive: true
        },
        {
          key: 'comfort' as FeatureKey,
          title: 'Comfort Verdoving',
          description: 'Een naaldloze verdoving die zonder prikken wordt aangebracht. Je voelt nog iets, maar veel minder intens. Voor een rustige, comfortabele ervaring zonder scherpe pijn.',
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
          title: '1 Year GHI Support',
          description: 'Een jaar lang persoonlijke begeleiding via WhatsApp of telefoon. Onze specialisten staan klaar om jouw vragen te beantwoorden en je groei van dichtbij te volgen. Altijd bereikbaar, altijd persoonlijk.',
          exclusive: false
        },
        {
          key: 'precision' as FeatureKey,
          title: 'GHI Precision Method™',
          description: 'Een exclusief chirurgisch protocol ontwikkeld en gecertificeerd door Berkant Dural. Het is de methode waarmee al onze artsen & trichologen persoonlijk worden opgeleid om dezelfde hoge standaard en precisie te waarborgen. Een unieke werkwijze die ambacht, detail en rust combineert in perfecte omstandigheden zodat elk resultaat een meesterwerk in haartransplantatie wordt.',
          exclusive: false
        }
      ]
    },
    Elite: {
      price: '€21.950',
      features: [
        {
          key: 'indicators' as FeatureKey,
          title: 'Package Indicators',
          description: 'Recovery x2 sneller\nMaximale dichtheid, volume & groei',
          exclusive: false
        },
        {
          key: 'fue' as FeatureKey,
          title: 'FUE Saffier / DHI',
          description: 'FUE Saffier is de standaard in haartransplantatie: met ultradunne saffieren mesjes voor nauwkeurige plaatsing, minimale littekens en sneller herstel. DHI maakt directe implantatie mogelijk zonder scheren, met maximale controle over richting en dichtheid.',
          exclusive: false
        },
        {
          key: 'stemcellrepair' as FeatureKey,
          title: 'GHI Stemcell Repair™',
          description: 'Een stamceltherapie, exclusief ontwikkeld en uitgevoerd door GlobalHair Institute. We oogsten lichaamseigen stamcellen om beschadigde haarzakjes te herstellen en het transplantatiegebied te versterken, wat resulteert in 20-35% meer dichtheid en langdurige stabiliteit.',
          exclusive: false
        },
        {
          key: 'fullcomfort' as FeatureKey,
          title: 'Full Comfort Anesthesia',
          description: 'Een korte, gecontroleerde narcose die zorgt dat de ingreep volledig pijnloos en ontspannen verloopt. Ideaal voor wie het hoogste niveau van comfort en rust wil tijdens de behandeling.',
          exclusive: true
        },
        {
          key: 'v6prime' as FeatureKey,
          title: 'V6 Hairboost® - Prime',
          description: 'Twee voor-behandelingen die het donorgebied versterken en de haarwortels activeren. Hierdoor kan er meer veilig geoogst worden en blijft het donorgebied vol, gezond en vrijwel onzichtbaar behandeld.',
          exclusive: true
        },
        {
          key: 'v6recovery' as FeatureKey,
          title: 'V6 Hairboost® - Recovery',
          description: 'Acht na-behandelingen die het herstel tot twee keer sneller maken. Dankzij onze exclusieve vitaminekuur stimuleert dit het groeiproces, waardoor je na 6 maanden al het resultaat ziet dat normaal pas na 12 maanden optreedt.',
          exclusive: true
        },
        {
          key: 'biotine' as FeatureKey,
          title: '1 Year Biotine Cure',
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
          description: 'Twee persoonlijke check-ups in onze kliniek in Barendrecht, uitgevoerd door een tricholoog. We volgen je herstel en haargroei nauwgezet op, voor maximale controle en het beste eindresultaat.',
          exclusive: true
        },
        {
          key: 'support' as FeatureKey,
          title: '1 Year GHI Support',
          description: 'Een jaar lang persoonlijke begeleiding via WhatsApp of telefoon. Onze specialisten staan klaar om jouw vragen te beantwoorden en je groei van dichtbij te volgen. Altijd bereikbaar, altijd persoonlijk.',
          exclusive: false
        },
        {
          key: 'precision' as FeatureKey,
          title: 'GHI Precision Method™',
          description: 'Een exclusief chirurgisch protocol ontwikkeld en gecertificeerd door Berkant Dural. Het is de methode waarmee al onze artsen & trichologen persoonlijk worden opgeleid om dezelfde hoge standaard en precisie te waarborgen. Een unieke werkwijze die ambacht, detail en rust combineert in perfecte omstandigheden zodat elk resultaat een meesterwerk in haartransplantatie wordt.',
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
          return '€4.950';
        case 'Premium':
          return '€8.950';
        default:
          return currentPackage.price;
      }
    }
    return currentPackage.price;
  };

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(350);
  };

  // Dynamic page key based on tier
  const pageKey = `package-${activeTier.toLowerCase()}`;

  // Get dynamic SEO content based on country, tier and language
  const seoContent = useMemo(() =>
    getSEOContent(activeCountry, activeTier, language as 'nl' | 'en'),
    [activeCountry, activeTier, language]
  );

  return (
    <>
      <div
        className={`popup-wrapper-fade ${isExiting ? 'popup-wrapper-fade-out' : ''}`}
        style={{
          overflow: 'hidden',
          position: 'fixed',
          inset: 0,
          zIndex: 30,
        }}
      >
        {/* Video Container - holds dynamically loaded videos */}
        <div
          ref={videoContainerRef}
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: 'none', zIndex: 0 }}
        />
        <div
          className="h-full flex items-start justify-center p-4 pt-4 md:pb-12"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <main
            className="flex flex-col w-full max-w-2xl md:max-w-[365px]"
            style={{ height: 'calc(var(--app-height) - 32px)' }}
          >
            <SwipeablePopupWrapper onClose={handleClose} className="h-full flex flex-col">
              <section
                className={`relative rounded-[24px] p-4 flex-1 mb-16 md:mb-24 flex flex-col popup-section-border reviews-page-fullscreen ${isExiting ? 'reviews-page-exit' : ''}`}
                style={{
                  background: '#0000001A',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0px 4.01px 8.72px 0px #00000040 inset, 0px -1px 4.71px 0px #FFFFFF40 inset, 0px 3.01px 1px 0px #00000040',
                  paddingBottom: 'clamp(1.5rem, 3vh, 2rem)',
                  zIndex: 10,
                  minHeight: 0
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
                    className={`flex-1 px-3 rounded-full text-[10px] font-light transition-all duration-300 ease-out ${activeCountry === 'nl'
                      ? 'silver-gradient-border bg-white/10 text-white scale-105'
                      : 'bg-transparent text-white hover:text-white/90 scale-100'
                      }`}
                    style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                    onClick={() => handleCountryChange('nl')}
                  >
                    Nederland
                  </button>
                  <button
                    disabled={isCountryDisabled('tr')}
                    className={`flex-1 px-3 rounded-full text-[10px] font-light transition-all duration-300 ease-out ${isCountryDisabled('tr')
                      ? 'opacity-40 cursor-not-allowed text-white/50'
                      : activeCountry === 'tr'
                        ? 'silver-gradient-border bg-white/10 text-white scale-105'
                        : 'bg-transparent text-white hover:text-white/90 scale-100'
                      }`}
                    style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                    onClick={() => {
                      if (!isCountryDisabled('tr')) {
                        handleCountryChange('tr');
                      }
                    }}
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
                  <div className="grid gap-1 grid-cols-3">
                    <button
                      className={`relative text-center px-4 py-2 rounded-full text-sm font-light transition-all duration-300 ease-out ${activeTier === 'Standard'
                        ? 'silver-gradient-border bg-white/10 text-white scale-105'
                        : 'bg-transparent text-white hover:text-white/90 scale-100'
                        }`}
                      onClick={() => handleTierChange('Standard')}
                    >
                      Standard
                    </button>
                    <button
                      className={`relative text-center px-4 py-2 rounded-full text-sm font-light transition-all duration-300 ease-out ${activeTier === 'Premium'
                        ? 'gold-gradient-border text-white scale-105'
                        : 'text-white hover:text-white/90 scale-100'
                        }`}
                      style={{
                        background: activeTier === 'Premium'
                          ? 'rgba(30, 58, 138, 0.15)'
                          : 'transparent'
                      }}
                      onClick={() => handleTierChange('Premium')}
                    >
                      Premium
                    </button>
                    <div className="relative w-full">
                      <button
                        className={`relative w-full text-center px-4 py-2 rounded-full text-sm font-light transition-all duration-300 ease-out ${activeCountry === 'tr'
                          ? 'text-white/15 cursor-not-allowed scale-100'
                          : activeTier === 'Elite'
                            ? 'gold-gradient-border text-white scale-105'
                            : 'text-white hover:text-white/90 scale-100'
                          }`}
                        style={{
                          background: activeTier === 'Elite' && activeCountry === 'nl'
                            ? 'rgba(88, 28, 135, 0.15)'
                            : 'transparent'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeCountry === 'tr') {
                            setShowEliteTooltip(!showEliteTooltip);
                            return;
                          }
                          handleTierChange('Elite');
                        }}
                      >
                        Elite
                      </button>

                      {activeCountry === 'tr' && showEliteTooltip && (
                        <div
                          className="absolute top-full right-0 mt-2 bg-black/90 border border-white/20 rounded px-3 py-1.5 z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="text-[10px] font-light text-white whitespace-nowrap">
                            {language === 'nl'
                              ? 'Alleen in Nederland'
                              : 'Only in Netherlands'}
                          </p>
                        </div>
                      )}
                    </div>
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
                                {(feature.key === 'precision' || feature.key === 'support') && (
                                  <Shield className="w-3 h-3 text-white/70 flex-shrink-0" strokeWidth={1.5} />
                                )}
                                {feature.key === 'indicators' && (
                                  <div className="flex gap-2 items-center">
                                    <div
                                      className="indicator-box"
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
                                          style={{
                                            width: '.8rem',
                                            height: '.8rem',
                                            marginLeft: '-4px'
                                          }}
                                        />
                                      )}
                                      {activeTier === 'Elite' && (
                                        <img
                                          src={chevronRightSvg}
                                          alt=""
                                          style={{
                                            width: '.8rem',
                                            height: '.8rem',
                                            marginLeft: '-4px'
                                          }}
                                        />
                                      )}
                                    </div>
                                    <div
                                      className="indicator-box"
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
                                          style={{
                                            width: '.8rem',
                                            height: '.8rem'
                                          }}
                                        />
                                      )}
                                      {activeTier === 'Elite' && (
                                        <>
                                          <img
                                            src={leafSvg}
                                            alt=""
                                            style={{
                                              width: '.8rem',
                                              height: '.8rem'
                                            }}
                                          />
                                          <img
                                            src={leafSvg}
                                            alt=""
                                            style={{
                                              width: '.8rem',
                                              height: '.8rem'
                                            }}
                                          />
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {feature.key !== 'indicators' && (
                                  <span className="feature-title text-white text-[12.5px] font-normal">{feature.title}</span>
                                )}
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
                              {feature.key === 'precision' ? (
                                <div className="text-white/80 font-light leading-relaxed" style={{ fontSize: '11px' }}>
                                  <img
                                    src={precisionBadge.src}
                                    alt="GHI Precision Method Badge"
                                    className="float-right ml-3 mb-2"
                                    style={{
                                      width: '120px',
                                      height: '120px',
                                      marginTop: '0.25rem'
                                    }}
                                  />
                                  <p style={{ fontSize: '11px' }}>
                                    {feature.description}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-white/80 font-light leading-relaxed" style={{ fontSize: '11px', whiteSpace: 'pre-line' }}>
                                  {feature.description}
                                </p>
                              )}
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

      <style>{`
  .silver-gradient-border {
    position: relative;
  }

  .silver-gradient-border::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1.28px;
    border-radius: inherit;
    background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 0;
  }

  .silver-gradient-border > * {
    position: relative;
    z-index: 1;
  }

  .gold-gradient-border {
    position: relative;
  }

  .gold-gradient-border::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1.28px;
    border-radius: inherit;
    background: linear-gradient(285.06deg, rgba(221, 97, 126, 0.25) 2.5%, #E3C06B 16.59%, #EFECE6 48.17%, #EFCF7C 83.98%, rgba(221, 97, 126, 0.25) 95.62%);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 0;
  }

  .gold-gradient-border > * {
    position: relative;
    z-index: 1;
  }

  .popup-section-border {
    position: relative;
  }

  .popup-section-border::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: inherit;
    background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 0;
  }

  .popup-section-border > * {
    position: relative;
    z-index: 1;
  }

  .indicator-box {
    position: relative;
    display: flex;
    align-items: center;
    justify-center;
  }

  .indicator-box::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: inherit;
    background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 0;
  }

  .indicator-box > * {
    position: relative;
    z-index: 1;
  }
`}</style>
    </>
  );
};
