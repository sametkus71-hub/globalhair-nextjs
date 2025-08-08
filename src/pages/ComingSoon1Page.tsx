import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { MetaHead } from '@/components/MetaHead';
import { Button } from '@/components/ui/button';

const ComingSoon1Page = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <>
      <MetaHead language={language} />
      <div className="min-h-[var(--app-height)] bg-gradient-hero flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="font-header text-6xl text-primary mb-8">
            GlobalHair
          </div>
          <h1 className="text-4xl font-header font-bold text-gray-800">
            {t('page.coming-soon')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            {language === 'nl' 
              ? 'We werken hard aan iets geweldigs. Kom binnenkort terug voor meer informatie.'
              : 'We are working hard on something amazing. Come back soon for more information.'
            }
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="font-header"
          >
            ← {language === 'nl' ? 'Terug naar home' : 'Back to home'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ComingSoon1Page;