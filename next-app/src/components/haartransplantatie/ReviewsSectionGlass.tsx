'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';

export const ReviewsSectionGlass = () => {
  const router = useRouter();
  const { language } = useLanguage();

  return (
    <div 
      className="px-4 py-8"
      style={{
        animation: 'fade-in 0.6s ease-out 1.2s both',
      }}
    >
      <div
        className="rounded-3xl p-6 overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.10)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div className="flex items-center space-x-4">
          {/* Quote */}
          <div className="flex-1">
            <p
              className="text-white text-lg mb-4"
              style={{
                fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                fontWeight: 500,
              }}
            >
              "{language === 'nl' 
                ? 'Geweldige ervaring. Mijn haar heeft er nog nooit beter uitgezien.' 
                : 'Amazing experience. My hair has never looked better.'}"
            </p>

            <button
              onClick={() => router.push(language === 'nl' ? '/nl/reviews' : '/en/reviews')}
              className="px-6 py-2.5 rounded-2xl transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: 'white',
                fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
            >
              {language === 'nl' ? 'Reviews' : 'Reviews'}
            </button>
          </div>

          {/* Before/After images */}
          <div className="flex-shrink-0">
            <div 
              className="w-32 h-32 rounded-2xl overflow-hidden"
              style={{
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className="flex h-full">
                <div className="w-1/2 bg-gray-700 flex items-center justify-center text-4xl">
                  👨
                </div>
                <div className="w-1/2 bg-gray-600 flex items-center justify-center text-4xl">
                  👨
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
