import { useEffect, useState } from 'react';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';

const AlgemeneVoorwaardenPage = () => {
  const [isExiting, setIsExiting] = useState(false);
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

  const content = language === 'nl' ? {
    title: 'Algemene Voorwaarden',
    lastUpdated: 'Laatst bijgewerkt: November 2025',
    sections: [
      {
        heading: '1. Toepasselijkheid',
        content: 'Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen Global Hair en de cliënt met betrekking tot haartransplantatie behandelingen en gerelateerde diensten.'
      },
      {
        heading: '2. Totstandkoming overeenkomst',
        content: 'Een overeenkomst komt tot stand na het boeken van een afspraak en het ontvangen van een bevestiging van Global Hair. De cliënt ontvangt voorafgaand aan de behandeling een intakegesprek waarin alle details worden besproken.'
      },
      {
        heading: '3. Prijzen en betaling',
        content: 'Alle vermelde prijzen zijn inclusief BTW, tenzij anders vermeld. Betaling dient te geschieden volgens de overeengekomen betalingsvoorwaarden. Bij annulering gelden specifieke annuleringsvoorwaarden.'
      },
      {
        heading: '4. Uitvoering behandeling',
        content: 'Global Hair voert alle behandelingen uit met de grootst mogelijke zorgvuldigheid en volgens de geldende professionele standaarden. Resultaten kunnen per persoon verschillen en worden niet gegarandeerd.'
      },
      {
        heading: '5. Aansprakelijkheid',
        content: 'Global Hair is niet aansprakelijk voor schade die het gevolg is van het niet opvolgen van instructies of adviezen. Aansprakelijkheid is beperkt tot het bedrag dat in het voorkomende geval onder de aansprakelijkheidsverzekering wordt uitbetaald.'
      },
      {
        heading: '6. Privacy en gegevensverwerking',
        content: 'Global Hair verwerkt persoonsgegevens conform de AVG en ons privacybeleid. De cliënt heeft het recht op inzage, correctie en verwijdering van zijn/haar gegevens.'
      },
      {
        heading: '7. Geschillen',
        content: 'Op alle overeenkomsten is Nederlands recht van toepassing. Geschillen worden bij voorkeur in onderling overleg opgelost. Is dit niet mogelijk, dan worden geschillen voorgelegd aan de bevoegde rechter in Nederland.'
      },
      {
        heading: '8. Contact',
        content: 'Voor vragen over deze algemene voorwaarden kunt u contact met ons opnemen via info@globalhair.nl of telefonisch op +31 85 888 4247.'
      }
    ]
  } : {
    title: 'Terms & Conditions',
    lastUpdated: 'Last updated: November 2025',
    sections: [
      {
        heading: '1. Applicability',
        content: 'These terms and conditions apply to all agreements between Global Hair and the client regarding hair transplant treatments and related services.'
      },
      {
        heading: '2. Formation of agreement',
        content: 'An agreement is formed after booking an appointment and receiving confirmation from Global Hair. The client receives an intake consultation prior to treatment where all details are discussed.'
      },
      {
        heading: '3. Prices and payment',
        content: 'All stated prices include VAT unless otherwise stated. Payment must be made according to the agreed payment terms. Specific cancellation conditions apply in case of cancellation.'
      },
      {
        heading: '4. Treatment execution',
        content: 'Global Hair performs all treatments with the utmost care and according to applicable professional standards. Results may vary per person and are not guaranteed.'
      },
      {
        heading: '5. Liability',
        content: 'Global Hair is not liable for damage resulting from failure to follow instructions or advice. Liability is limited to the amount paid out under the liability insurance in the relevant case.'
      },
      {
        heading: '6. Privacy and data processing',
        content: 'Global Hair processes personal data in accordance with GDPR and our privacy policy. The client has the right to access, correct, and delete their data.'
      },
      {
        heading: '7. Disputes',
        content: 'Dutch law applies to all agreements. Disputes are preferably resolved through mutual consultation. If this is not possible, disputes are submitted to the competent court in the Netherlands.'
      },
      {
        heading: '8. Contact',
        content: 'For questions about these terms and conditions, you can contact us at info@globalhair.nl or by phone at +31 85 888 4247.'
      }
    ]
  };

  return (
    <>
      <MetaHead 
        language={language}
        page="terms-conditions"
        title={content.title}
        description={language === 'nl' ? 'Algemene voorwaarden van Global Hair' : 'Terms & Conditions of Global Hair'}
      />
      
      <div 
        className={`fixed inset-0 z-50 overflow-y-auto bg-white transition-opacity duration-300 ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <PopupCloseButton onClose={handleClose} />
        
        <div className="min-h-screen py-20 px-6 md:px-8">
          <div 
            className="max-w-[800px] mx-auto"
            style={{
              animation: isExiting ? 'none' : 'fade-in 0.3s ease-out'
            }}
          >
            <h1 className="text-3xl md:text-4xl font-semibold mb-2" style={{ color: '#4A2C2A' }}>
              {content.title}
            </h1>
            <p className="text-sm mb-8 opacity-70" style={{ color: '#4A2C2A' }}>
              {content.lastUpdated}
            </p>

            <div className="space-y-6">
              {content.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-xl font-semibold mb-3" style={{ color: '#4A2C2A' }}>
                    {section.heading}
                  </h2>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: '#4A2C2A' }}>
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlgemeneVoorwaardenPage;
