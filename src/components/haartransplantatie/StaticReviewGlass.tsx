import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import reviewImage from '@/assets/review-before-after.png';

export const StaticReviewGlass = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="px-4 pb-6">
      <div
        className="rounded-[20px] p-5 overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Quote + Button */}
          <div className="flex-1 min-w-0">
            <p
              className="text-white text-[15px] leading-snug mb-4"
              style={{
                fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                fontWeight: 500,
              }}
            >
              "Amazing experience. My hair has never looked better"
            </p>

            <button
              onClick={() => navigate(language === 'nl' ? '/nl/reviews' : '/en/reviews')}
              className="px-5 py-2.5 rounded-[16px] text-white text-[14px] font-medium transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
              }}
            >
              Reviews
            </button>
          </div>

          {/* Right: Before/After Image */}
          <div className="flex-shrink-0">
            <div
              className="w-[120px] h-[160px] rounded-[16px] overflow-hidden"
              style={{
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
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
