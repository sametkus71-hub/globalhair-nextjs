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

            <div
              className="relative rounded-full p-[1px] mt-4"
              style={{
                background: 'linear-gradient(180deg, #4B555E 0%, #ACB9C1 25%, #FFFFFF 50%, #ACB9C1 75%, #4B555E 100%)',
                width: 'fit-content',
                margin: '0 auto',
              }}
            >
              <button
                onClick={() => navigate(language === 'nl' ? '/nl/reviews' : '/en/reviews')}
                className="h-[56px] px-6 rounded-full text-center transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(1.6px)',
                  WebkitBackdropFilter: 'blur(1.6px)',
                  fontFamily: 'Inter, SF Pro Display, system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.92)',
                  letterSpacing: '0.2px',
                  boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25), inset 0 4px 8.7px rgba(0, 0, 0, 0.25), inset 0 -1px 4.7px rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(1px)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Reviews
              </button>
            </div>
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
