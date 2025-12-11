import { useEffect, useState } from 'react';
import { usePopupClose } from '@/components/PopupCloseButton';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/hooks/useLanguage';
import { CookieSettings } from '@/components/CookieSettings';

const PrivacyPolicyPage = () => {
  const [isExiting, setIsExiting] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const { handlePopupClose } = usePopupClose();
  const { language } = useLanguage();

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(200);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const contentNL = {
    title: 'Privacy Policy',
    intro: 'Wij zijn er ons van bewust dat u vertrouwen stelt in ons. Wij beschouwen het dan ook als onze verantwoordelijkheid om uw privacy te beschermen. Op deze pagina willen we u laten weten welke gegevens we verzamelen wanneer u onze website gebruikt, waarom we deze gegevens verzamelen, en hoe we deze gebruiken om uw gebruikservaring te verbeteren. Zo krijgt u een duidelijk beeld van hoe wij te werk gaan.\n\nDit privacybeleid is van toepassing op de diensten van GlobalHair. We willen benadrukken dat GlobalHair niet verantwoordelijk is voor het privacybeleid van andere websites en bronnen. Door gebruik te maken van deze website geeft u aan ons privacybeleid te accepteren.',
    sections: [
      {
        heading: 'Onze inzet voor uw privacy',
        content: 'GlobalHair respecteert de privacy van alle gebruikers van haar website en zorgt ervoor dat de persoonlijke informatie die u ons verschaft vertrouwelijk wordt behandeld.'
      },
      {
        heading: 'Ons gebruik van verzamelde gegevens',
        content: ''
      },
      {
        heading: 'Gebruik van onze diensten',
        content: 'Wanneer u zich aanmeldt voor een van onze diensten, vragen we u om persoonsgegevens te verstrekken. Deze gegevens worden uitsluitend gebruikt om de betreffende dienst uit te voeren. De gegevens worden opgeslagen op onze beveiligde servers of op die van derden. Wij zullen deze gegevens niet combineren met andere persoonlijke gegevens waarover wij beschikken.'
      },
      {
        heading: 'Communicatie',
        content: 'Wanneer u e-mails of andere berichten naar ons verzendt, bewaren we die berichten mogelijk. Soms vragen wij u naar uw persoonlijke gegevens die relevant zijn voor de desbetreffende situatie. Dit maakt het mogelijk om uw vragen te verwerken en uw verzoeken te beantwoorden. De gegevens worden opgeslagen op onze beveiligde servers of op die van derden. Wij zullen deze gegevens niet combineren met andere persoonlijke gegevens waarover wij beschikken.'
      },
      {
        heading: 'Cookies',
        content: 'Wij verzamelen gegevens voor onderzoek om zo een beter inzicht te krijgen in onze klanten, zodat wij onze diensten hierop kunnen afstemmen.\n\nDeze website maakt gebruik van "cookies" (tekstbestandtjes die op uw computer worden geplaatst) om de website te helpen analyseren hoe gebruikers de site gebruiken. De door het cookie gegenereerde informatie over uw gebruik van de website kan worden overgebracht naar onze eigen beveiligde servers of die van een derde partij. Wij gebruiken deze informatie om bij te houden hoe u de website gebruikt, om rapporten over de website-activiteit op te stellen en andere diensten aan te bieden met betrekking tot website-activiteit en internetgebruik.'
      },
      {
        heading: 'Doeleinden',
        content: 'We verzamelen of gebruiken geen informatie voor andere doeleinden dan de doeleinden die worden beschreven in dit privacybeleid, tenzij we van tevoren uw toestemming hiervoor hebben verkregen.'
      },
      {
        heading: 'Derden',
        content: 'De informatie wordt niet met derden gedeeld. In enkele gevallen kan de informatie intern gedeeld worden. Onze werknemers zijn verplicht om de vertrouwelijkheid van uw gegevens te respecteren.'
      },
      {
        heading: 'Veranderingen',
        content: 'Deze privacyverklaring is afgestemd op het gebruik van en de mogelijkheden op deze site. Eventuele aanpassingen en/of veranderingen van deze site kunnen leiden tot wijzigingen in deze privacyverklaring. Het is daarom raadzaam om regelmatig deze privacyverklaring te raadplegen.'
      },
      {
        heading: 'Keuzes voor persoonsgegevens',
        content: 'Wij bieden alle bezoekers de mogelijkheid tot het inzien, veranderen of verwijderen van alle persoonlijke informatie die op dat moment aan ons is verstrekt.'
      },
      {
        heading: 'Aanpassen/Uitschrijven communicatie',
        content: 'Als u uw gegevens wilt aanpassen of uzelf uit onze bestanden wilt laten halen, kunt u contact met ons opnemen via de onderstaande contactgegevens.'
      },
      {
        heading: 'Cookies uitzetten',
        content: 'De meeste browsers zijn standaard ingesteld om cookies te accepteren, maar u kunt uw browser opnieuw instellen om alle cookies te weigeren of om aan te geven wanneer een cookie wordt verzonden. Het is echter mogelijk dat sommige functies en services op onze en andere websites niet correct functioneren als cookies zijn uitgeschakeld in uw browser.\n\nGlobalHair schakelt ook derden zoals Google in voor het analyseren van de gegevens over uw websitegebruik en voor het personaliseren van de website en communicatie, en het tonen van relevante aanbiedingen en advertenties. GlobalHair stuurt voor deze doeleinden geen gegevens zoals naam, adres, e-mailadres, of andere direct identificerende gegevens naar deze partijen. Google kan persoonsgegevens van u ontvangen door deze te verzamelen met cookies. In de Google\'s Privacy & Term site vindt u ook meer informatie over hoe en waarom de verzameling van persoonsgegevens met cookies door Google wordt gedaan.'
      },
      {
        heading: 'Vragen en feedback',
        content: 'We controleren regelmatig of we aan dit privacybeleid voldoen. Als u vragen heeft over dit privacybeleid, kunt u contact met ons opnemen:\n\nGlobalHair\nPesetastraat 76\n2321GK Leiden\n+31 (0) 85 75 00 577\ncontact@globalhair.nl'
      }
    ]
  };

  const contentEN = {
    title: 'Privacy Policy',
    intro: 'We are aware that you place your trust in us. We therefore consider it our responsibility to protect your privacy.',
    cookieSettingsButton: 'Manage Cookie Preferences',
    sections: [
      {
        heading: 'Our commitment to your privacy',
        content: 'GlobalHair respects the privacy of all users of its website and ensures that the personal information you provide to us is treated confidentially.'
      }
    ]
  };

  const content = language === 'nl' ? contentNL : contentEN;

  return (
    <>
      <SEOHead 
        title={content.title}
        description={language === 'nl' ? 'Privacybeleid van GlobalHair Institute.' : 'Privacy Policy of GlobalHair Institute.'}
      />
      
      <div 
        className={`fixed inset-0 z-50 overflow-y-auto bg-white transition-opacity duration-300 font-['Inter'] ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <button
          onClick={handleClose}
          className="fixed top-6 right-6 z-50 w-8 h-8 flex items-center justify-center text-gray-800 hover:text-gray-600 transition-colors"
          aria-label={language === 'nl' ? 'Sluiten' : 'Close'}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        
        <div className="min-h-screen py-20 px-6 md:px-8">
          <div 
            className="max-w-[800px] mx-auto"
            style={{
              animation: isExiting ? 'none' : 'fade-in 0.3s ease-out'
            }}
          >
            <h1 className="text-2xl md:text-3xl font-normal mb-4 text-gray-900">
              {content.title}
            </h1>

            {/* Cookie Settings Button */}
            <button
              onClick={() => setShowCookieSettings(true)}
              className="mb-6 text-sm text-gray-600 underline hover:text-gray-900 transition-colors"
            >
              {language === 'nl' ? 'Cookie-instellingen beheren' : 'Manage Cookie Preferences'}
            </button>
            
            {content.intro && (
              <p className="text-xs leading-relaxed text-gray-600 font-light mb-8 whitespace-pre-line">
                {content.intro}
              </p>
            )}

            <div className="space-y-6">
              {content.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-sm font-normal mb-1.5 text-gray-900">
                    {section.heading}
                  </h2>
                  {section.content && (
                    <p className="text-xs leading-relaxed text-gray-600 font-light whitespace-pre-line">
                      {section.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Dialog */}
      {showCookieSettings && (
        <CookieSettings
          isOpen={showCookieSettings}
          onClose={() => setShowCookieSettings(false)}
          onSave={() => setShowCookieSettings(false)}
        />
      )}
    </>
  );
};

export default PrivacyPolicyPage;
