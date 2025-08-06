import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';

export const ReviewsTextArea = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black">
          Bekijk onze reviews
        </h1>
      </div>
    </div>
  );
};