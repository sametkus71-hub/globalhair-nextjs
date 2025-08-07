import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';

export const MissionTextArea = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          {t('mission.title')}
        </h1>
      </div>
    </div>
  );
};