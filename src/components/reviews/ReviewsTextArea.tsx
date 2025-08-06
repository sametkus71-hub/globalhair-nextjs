import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';

export const ReviewsTextArea = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-4">
          {t('reviews.title')}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed max-w-md">
          {t('reviews.description')}
        </p>
      </div>
    </div>
  );
};