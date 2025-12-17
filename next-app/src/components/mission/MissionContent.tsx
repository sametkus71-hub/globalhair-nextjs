'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';

export const MissionContent = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Mission Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>

        {/* Mission Content */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {t('mission.subtitle')}
          </h2>
          
          <div className="text-gray-300 text-lg leading-relaxed space-y-4">
            <p>{t('mission.description1')}</p>
            <p>{t('mission.description2')}</p>
            <p>{t('mission.description3')}</p>
          </div>
          
          {/* Values */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('mission.value1.title')}
              </h3>
              <p className="text-gray-300">
                {t('mission.value1.description')}
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('mission.value2.title')}
              </h3>
              <p className="text-gray-300">
                {t('mission.value2.description')}
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('mission.value3.title')}
              </h3>
              <p className="text-gray-300">
                {t('mission.value3.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};