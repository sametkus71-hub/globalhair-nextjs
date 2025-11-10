import { useEffect, useState } from 'react';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';

const PrivacyPolicyPage = () => {
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
    title: 'Privacybeleid',
    lastUpdated: 'Laatst bijgewerkt: November 2025',
    sections: [
      {
        heading: '1. Inleiding',
        content: 'Global Hair hecht grote waarde aan uw privacy. In dit privacybeleid leggen wij uit welke persoonsgegevens wij verzamelen, hoe wij deze gebruiken, en welke rechten u heeft met betrekking tot uw gegevens.'
      },
      {
        heading: '2. Welke gegevens verzamelen wij?',
        content: 'Wij verzamelen persoonlijke informatie zoals uw naam, e-mailadres, telefoonnummer en medische gegevens die relevant zijn voor de behandeling. Deze gegevens worden alleen verzameld met uw toestemming en zijn noodzakelijk voor het uitvoeren van onze dienstverlening.'
      },
      {
        heading: '3. Hoe gebruiken wij uw gegevens?',
        content: 'Uw gegevens worden gebruikt voor het plannen en uitvoeren van uw behandeling, communicatie over uw afspraken, en het verbeteren van onze dienstverlening. Wij delen uw gegevens niet met derden zonder uw expliciete toestemming.'
      },
      {
        heading: '4. Beveiliging van uw gegevens',
        content: 'Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, misbruik of ongeautoriseerde toegang.'
      },
      {
        heading: '5. Uw rechten',
        content: 'U heeft het recht om uw gegevens in te zien, te corrigeren of te verwijderen. Ook kunt u bezwaar maken tegen de verwerking van uw gegevens. Neem contact met ons op om deze rechten uit te oefenen.'
      },
      {
        heading: '6. Contact',
        content: 'Voor vragen over dit privacybeleid kunt u contact met ons opnemen via info@globalhair.nl of telefonisch op +31 85 888 4247.'
      }
    ]
  } : {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: November 2025',
    sections: [
      {
        heading: '1. Introduction',
        content: 'Global Hair values your privacy. This privacy policy explains what personal data we collect, how we use it, and what rights you have regarding your data.'
      },
      {
        heading: '2. What data do we collect?',
        content: 'We collect personal information such as your name, email address, phone number, and medical data relevant to the treatment. This data is only collected with your consent and is necessary for providing our services.'
      },
      {
        heading: '3. How do we use your data?',
        content: 'Your data is used for scheduling and performing your treatment, communication about your appointments, and improving our services. We do not share your data with third parties without your explicit consent.'
      },
      {
        heading: '4. Security of your data',
        content: 'We take appropriate technical and organizational measures to protect your personal data against loss, misuse, or unauthorized access.'
      },
      {
        heading: '5. Your rights',
        content: 'You have the right to view, correct, or delete your data. You can also object to the processing of your data. Contact us to exercise these rights.'
      },
      {
        heading: '6. Contact',
        content: 'For questions about this privacy policy, you can contact us at info@globalhair.nl or by phone at +31 85 888 4247.'
      }
    ]
  };

  return (
    <>
      <MetaHead 
        language={language}
        page="privacy-policy"
        title={content.title}
        description={language === 'nl' ? 'Privacybeleid van Global Hair' : 'Privacy Policy of Global Hair'}
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
            <h1 className="text-3xl md:text-4xl font-normal mb-2 text-gray-900">
              {content.title}
            </h1>
            <p className="text-sm mb-12 text-gray-500">
              {content.lastUpdated}
            </p>

            <div className="space-y-6">
              {content.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-sm font-normal mb-1.5 text-gray-900">
                    {section.heading}
                  </h2>
                  <p className="text-xs leading-relaxed text-gray-600 font-light">
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

export default PrivacyPolicyPage;
