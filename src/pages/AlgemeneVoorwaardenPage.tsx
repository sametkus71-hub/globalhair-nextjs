import { useEffect, useState } from 'react';
import { usePopupClose } from '@/components/PopupCloseButton';
import { SEOHead } from '@/components/SEOHead';
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

  const contentNL = {
    title: 'ALGEMENE VOORWAARDEN GLOBALHAIR',
    subtitle: 'Behandelingsovereenkomst',
    sections: [
      {
        heading: 'Artikel 1 – Begripsbepalingen',
        content: 'GlobalHair: Dienstverlener die ondersteuning biedt bij haartransplantatiebehandelingen in binnen- en buitenland, inclusief aanvullende diensten zoals verblijf en transfers, voor zover van toepassing.\n\nOvereenkomst in Turkije: De overeenkomst tussen GlobalHair en de cliënt met betrekking tot een haartransplantatiebehandeling in Turkije. Deze overeenkomst kan onder meer omvatten: het faciliteren van contact met een medische instelling, het organiseren van verblijf en transfers. De inhoud van de overeenkomst wordt afgestemd op de gekozen diensten en is gebaseerd op de offerte van de medische instelling.\n\nOvereenkomst in Nederland: De overeenkomst tussen GlobalHair en de cliënt met betrekking tot een haartransplantatiebehandeling in Nederland. De behandeling vindt plaats als dagopname in de kliniek van GlobalHair te Barendrecht en omvat geen verblijf of transfers.\n\nDienstverlener: Iedere partij, waaronder vervoerders, accommodaties of overige betrokken derden, die een onderdeel van de overeengekomen dienstverlening uitvoert.\n\nMedische instelling: De instelling waar de haartransplantatiebehandeling plaatsvindt, op basis van een vooraf verstrekte offerte.\n\nCliënt: Iedere natuurlijke of rechtspersoon die een overeenkomst aangaat met GlobalHair.'
      },
      {
        heading: 'Artikel 2 – Toepasselijkheid',
        content: '2.1 Deze voorwaarden zijn van toepassing op alle overeenkomsten en rechtsverhoudingen tussen GlobalHair en de cliënt, tenzij uitdrukkelijk schriftelijk anders is overeengekomen.\n\n2.2 Afwijkingen van deze voorwaarden zijn slechts geldig indien schriftelijk bevestigd door GlobalHair.\n\n2.3 De toepasselijkheid van eventuele algemene voorwaarden van de cliënt wordt uitdrukkelijk van de hand gewezen.'
      },
      {
        heading: 'Artikel 3 – Totstandkoming van de overeenkomst',
        content: '3.1 De overeenkomst komt tot stand na schriftelijke aanvaarding van het aanbod en ontvangst van de aanbetaling door GlobalHair.\n\n3.2 Met het voldoen van de aanbetaling bevestigt de cliënt tevens kennis te hebben genomen van en akkoord te gaan met deze algemene voorwaarden.\n\n3.3 Indien een medische behandeling geen doorgang kan vinden als gevolg van medische ongeschiktheid van de cliënt, komt dit voor rekening en risico van de cliënt.\n\n3.4 GlobalHair is niet aansprakelijk voor de juistheid van door derden verstrekt informatiemateriaal, zoals folders of websites van medische instellingen.\n\n3.5 Bij overmacht aan de zijde van GlobalHair wordt de overeenkomst opgeschort zonder dat recht ontstaat op schadevergoeding.'
      },
      {
        heading: 'Artikel 4 – Betaling en annulering',
        content: '4.1 De aanbetaling dient binnen 72 uur na acceptatie van het aanbod te zijn voldaan, tenzij anders overeengekomen.\n\n4.2 Betalingen dienen te geschieden zonder enige inhouding, korting of verrekening.\n\n4.3 Bij niet tijdige betaling is de cliënt van rechtswege in verzuim. GlobalHair is in dat geval gerechtigd om buitengerechtelijke kosten en annuleringskosten in rekening te brengen.\n\n4.4 Bij annulering door de cliënt zijn de volgende kosten verschuldigd:\n- De aanbetaling is niet-restitueerbaar in verband met gemaakte voorbereidingskosten (verblijf).\n- Annulering tot 3 maanden vóór de behandeling: 50% van de behandelkosten.\n- Annulering vanaf 31 dagen vóór de behandeling: 75% van de behandelkosten.\n- Annulering binnen 14 dagen vóór de behandeling: 100% van de behandelkosten.\n\n4.5 Indien een V6 Hairboost® behandeling niet eerder dan 48 uur voor de behandeling wordt geannuleerd, worden er kosten in rekening gebracht.\n\n4.6 Alle kosten voortvloeiend uit verzuim, waaronder incassokosten, zijn voor rekening van de cliënt.'
      },
      {
        heading: 'Artikel 5 – Prijswijzigingen',
        content: '5.1 GlobalHair behoudt zich het recht voor om prijzen te wijzigen tot 5 weken voorafgaand aan de behandeling indien externe kostprijsfactoren daartoe aanleiding geven.'
      },
      {
        heading: 'Artikel 6 – Verantwoordelijkheid documenten',
        content: '6.1 De cliënt is verantwoordelijk voor het tijdig in bezit hebben van geldige reis- en medische documenten.\n\n6.2 Indien een behandeling niet doorgaat vanwege ontbrekende documenten, is de cliënt verantwoordelijk voor de hieruit voortvloeiende kosten.'
      },
      {
        heading: 'Artikel 7 – Informatievoorziening',
        content: 'GlobalHair verstrekt de benodigde informatie over verblijf, transfers en behandeling uiterlijk 1 week voor vertrek, tenzij sprake is van overmacht of vertraging buiten haar invloedssfeer.'
      },
      {
        heading: 'Artikel 8 – Wijzigingen en annuleringen',
        content: '8.1 Wijzigingsverzoeken van de cliënt worden tot 31 dagen vóór vertrek in behandeling genomen.\n\n8.2 Bij afwijzing van een wijzigingsverzoek behoudt de cliënt de keuze tussen uitvoering van de oorspronkelijke overeenkomst of annulering conform artikel 4.\n\n8.3 De annuleringsvoorwaarden zoals benoemd in artikel 4.4 zijn onverkort van toepassing.'
      },
      {
        heading: 'Artikel 9 – Wijziging door GlobalHair',
        content: '9.1 GlobalHair kan wijzigingen aanbrengen in de dienstverlening indien sprake is van overmacht of omstandigheden buiten haar invloedssfeer.\n\n9.2 GlobalHair zal bij wezenlijke wijzigingen een gelijkwaardig alternatief aanbieden.'
      },
      {
        heading: 'Artikel 10 – Aansprakelijkheid',
        content: '10.1 GlobalHair is uitsluitend aansprakelijk voor schade als gevolg van verblijf en transfers, mits sprake is van toerekenbare tekortkoming.\n\n10.2 GlobalHair is niet aansprakelijk voor medische behandelingen en het resultaat daarvan.'
      },
      {
        heading: 'Artikel 11 – Uitsluitingen',
        content: '11.1 GlobalHair aanvaardt geen aansprakelijkheid voor schade voortvloeiend uit medische ingrepen, beslissingen van artsen of het uitblijven van het gewenste resultaat.\n\n11.2 GlobalHair is niet aansprakelijk voor vertragingen of wijzigingen veroorzaakt door derden of overmacht.'
      },
      {
        heading: 'Artikel 12 – Verplichtingen cliënt',
        content: 'De cliënt is verplicht zich te houden aan richtlijnen van GlobalHair en de medische instelling. Schade ontstaan door nalatigheid komt voor rekening van de cliënt.'
      },
      {
        heading: 'Artikel 13 – Nazorg',
        content: 'De cliënt verplicht zich tot het volgen van de nazorginstructies zoals verstrekt door GlobalHair. Niet-naleving hiervan kan van invloed zijn op het resultaat.'
      },
      {
        heading: "Artikel 14 – Haarlijn & Risico's",
        content: '14.1 Nadat de cliënt schriftelijk akkoord is gegaan met de voorgestelde haarlijn, is deze definitief. Latere wijzigingsverzoeken kunnen niet worden gehonoreerd.\n\n14.2 De cliënt is zich ervan bewust dat een haartransplantatie een medische ingreep betreft, waarbij het uiteindelijke resultaat kan variëren per individu. Factoren zoals genetische aanleg, herstelproces en naleving van nazorgadviezen kunnen hierbij van invloed zijn.\n\n14.3 Indien de cliënt door eigen nalatigheid — zoals het niet tijdig aanleveren van medische informatie of benodigde documenten — verhinderd is om de behandeling te ondergaan of indien deze daardoor moet worden uitgesteld, komen de kosten volledig voor rekening van de cliënt, conform artikel 4.'
      },
      {
        heading: 'Artikel 15 – Klachten',
        content: '15.1 Klachten dienen zo spoedig mogelijk te worden gemeld bij de dienstverlener of GlobalHair.\n\n15.2 Indien de klacht niet bevredigend wordt afgehandeld, kan deze schriftelijk worden ingediend bij GlobalHair.\n\n15.3 Op deze overeenkomst is uitsluitend Nederlands recht van toepassing. De bevoegde rechter is gevestigd in Nederland.'
      }
    ]
  };

  const contentEN = {
    title: 'Terms & Conditions',
    subtitle: 'Treatment Agreement',
    sections: [
      {
        heading: '1. Applicability',
        content: 'These terms and conditions apply to all agreements between Global Hair and the client regarding hair transplant treatments and related services.'
      }
    ]
  };

  const content = language === 'nl' ? contentNL : contentEN;

  return (
    <>
      <SEOHead 
        title={content.title}
        description={language === 'nl' ? 'Algemene voorwaarden van GlobalHair Institute.' : 'Terms & Conditions of GlobalHair Institute.'}
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
            <h1 className="text-2xl md:text-3xl font-normal mb-1 text-gray-900">
              {content.title}
            </h1>
            {content.subtitle && (
              <p className="text-sm mb-8 text-gray-700 font-light">
                {content.subtitle}
              </p>
            )}

            <div className="space-y-6">
              {content.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-sm font-normal mb-1.5 text-gray-900">
                    {section.heading}
                  </h2>
                  <p className="text-xs leading-relaxed text-gray-600 font-light whitespace-pre-line">
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
