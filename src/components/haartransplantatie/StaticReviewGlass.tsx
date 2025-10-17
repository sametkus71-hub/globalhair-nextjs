import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import reviewImage from '@/assets/review-before-after.png';

export const StaticReviewGlass = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="pb-6">
      <div
        className="rounded-[24px] p-6 overflow-hidden"
        style={{
          background: 'rgba(119, 125, 129, 0.12)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Quote + Button */}
          <div className="flex-1 min-w-0">
            <p
              className="text-white text-[13px] text-center mb-4"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 300,
                lineHeight: '160%',
                letterSpacing: '-0.04em',
                maxWidth: '205px',
              }}
            >
              "Amazing experience. My hair has never looked better"
            </p>

            <button
              onClick={() => navigate(language === 'nl' ? '/nl/reviews' : '/en/reviews')}
              className="px-6 py-3 rounded-[20px] text-white text-[15px] font-medium transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                backdropFilter: 'blur(1.6px)',
                WebkitBackdropFilter: 'blur(1.6px)',
                boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25), inset 0 4px 8.7px rgba(0, 0, 0, 0.25), inset 0 -1px 4.7px rgba(255, 255, 255, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Reviews
            </button>
          </div>

          {/* Right: Before/After Image */}
          <div className="flex-shrink-0">
            <div
              className="w-[130px] h-[130px] rounded-[20px] overflow-hidden"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
              }}
            >
              <img
                src={reviewImage}
                alt="Before and after hair transplant result"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
