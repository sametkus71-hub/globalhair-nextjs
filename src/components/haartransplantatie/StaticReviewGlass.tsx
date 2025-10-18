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
          <div className="flex-1 min-w-0 flex flex-col items-center">
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
              className="silver-gradient-border px-12 py-2 rounded-full text-white text-[14px] font-normal transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.15)',
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

const silverGradientBorderStyles = `
  .silver-gradient-border {
    position: relative;
  }

  .silver-gradient-border::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1.3px;
    border-radius: inherit;
    background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 0;
  }

  .silver-gradient-border > * {
    position: relative;
    z-index: 1;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleId = 'silver-gradient-border-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = silverGradientBorderStyles;
    document.head.appendChild(style);
  }
}
