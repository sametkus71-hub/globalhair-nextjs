import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';

export const HowTabContent = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-light text-white">
            {language === 'nl' ? 'Hoe werkt een haartransplantatie?' : 'How does a hair transplant work?'}
          </h2>
          <p className="text-white/70 leading-relaxed">
            {language === 'nl' 
              ? 'Een haartransplantatie is een geavanceerde procedure waarbij haarzakjes van een donorgebied (meestal de achterkant van het hoofd) worden verplaatst naar kale of dunner wordende gebieden.'
              : 'A hair transplant is an advanced procedure where hair follicles from a donor area (usually the back of the head) are relocated to bald or thinning areas.'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-light text-white">
              {language === 'nl' ? '1. Consultatie & Planning' : '1. Consultation & Planning'}
            </h3>
            <p className="text-white/70 leading-relaxed">
              {language === 'nl'
                ? 'Tijdens het eerste consult analyseren we uw haarsituatie en bespreken we uw wensen en verwachtingen. We bepalen samen het beste behandelplan.'
                : 'During the initial consultation, we analyze your hair situation and discuss your wishes and expectations. Together we determine the best treatment plan.'}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-light text-white">
              {language === 'nl' ? '2. Donorgebied Preparatie' : '2. Donor Area Preparation'}
            </h3>
            <p className="text-white/70 leading-relaxed">
              {language === 'nl'
                ? 'Het donorgebied wordt zorgvuldig voorbereid. Bij de FUE-methode worden individuele haarzakjes één voor één geëxtraheerd met microchirurgische precisie.'
                : 'The donor area is carefully prepared. With the FUE method, individual hair follicles are extracted one by one with microsurgical precision.'}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-light text-white">
              {language === 'nl' ? '3. Grafts Plaatsing' : '3. Graft Placement'}
            </h3>
            <p className="text-white/70 leading-relaxed">
              {language === 'nl'
                ? 'De geëxtraheerde haarzakjes worden strategisch geplaatst in het ontvangende gebied, waarbij rekening wordt gehouden met natuurlijke haargroeipatronen en dichtheid.'
                : 'The extracted hair follicles are strategically placed in the recipient area, taking into account natural hair growth patterns and density.'}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-light text-white">
              {language === 'nl' ? '4. Herstel & Resultaat' : '4. Recovery & Results'}
            </h3>
            <p className="text-white/70 leading-relaxed">
              {language === 'nl'
                ? 'Na de behandeling volgt een herstelperiode waarbij de getransplanteerde haren zich vestigen. Binnen 3-6 maanden begint het nieuwe haar te groeien, met volledige resultaten na 12-18 maanden.'
                : 'After treatment, a recovery period follows during which the transplanted hairs settle. Within 3-6 months, new hair begins to grow, with full results after 12-18 months.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
