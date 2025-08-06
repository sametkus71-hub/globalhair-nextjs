import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';

export const ReviewsTextArea = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black">
          Bekijk onze reviews
        </h1>
      </div>
    </div>
  );
};