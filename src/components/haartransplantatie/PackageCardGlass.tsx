import { ChevronRight, Leaf } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface PackageCardGlassProps {
  className?: string;
}

const packageData = {
  Standard: {
    title: 'FUE Saffier',
    subtitle: null,
    growth: 1,
    recovery: 1,
    anchor: '#packages-standard',
  },
  Premium: {
    title: 'FUE Saffier / DHI',
    subtitle: 'V6 Hairboost®',
    growth: 2,
    recovery: 2,
    anchor: '#packages-premium',
  },
  Advanced: {
    title: 'FUE Saffier / DHI',
    subtitle: 'V6 Hairboost® + GHI Stemcell repair™',
    growth: 3,
    recovery: 3,
    anchor: '#packages-advanced',
  },
};

export const PackageCardGlass = ({ className }: PackageCardGlassProps) => {
  const { language } = useLanguage();

  const renderLeaves = (count: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <Leaf
            key={i}
            className="w-4 h-4"
            strokeWidth={1.5}
            style={{
              color: i < count ? 'rgba(74, 222, 128, 1)' : 'rgba(255, 255, 255, 0.2)',
              fill: i < count ? 'rgba(74, 222, 128, 0.3)' : 'transparent',
            }}
          />
        ))}
      </div>
    );
  };

  const renderArrows = (count: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center"
          >
            <ChevronRight
              className="w-4 h-4"
              strokeWidth={2}
              style={{
                color: i < count ? 'rgba(96, 165, 250, 1)' : 'rgba(255, 255, 255, 0.2)',
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`packages-block gold-gradient-border relative mx-2 mt-2 rounded-3xl transition-all duration-500 ${className || ''}`}
      id="packages-static"
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Packages Row - 3 columns with 2 separators */}
      <div
        className="packages-row p-4"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1px 1fr 1px 1fr',
          alignItems: 'start',
        }}
      >
        {/* Standard Column */}
        <div className="pkg-col pkg-col--standard">
          {/* Package tier indicator */}
          <div className="flex justify-center mb-3">
            <div
              className="silver-gradient-border inline-flex items-center rounded-full px-4 py-1.5"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <span
                className="text-xs font-medium"
                style={{
                  color: 'white',
                  fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                }}
              >
                Standard
              </span>
            </div>
          </div>

          {/* Icons row */}
          <div className="flex justify-center space-x-3 mb-3">
            <div
              className="silver-gradient-border flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <ChevronRight className="w-4 h-4 text-white/60" strokeWidth={1.5} />
              {renderLeaves(1)}
            </div>
            <div
              className="silver-gradient-border flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              {renderArrows(1)}
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-white text-center text-lg font-semibold mb-1"
            style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
          >
            FUE Saffier
          </h3>
        </div>

        {/* Vertical Separator 1 */}
        <div
          className="v-sep"
          aria-hidden="true"
          style={{
            width: '1px',
            height: '100%',
            background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.2) 50%, transparent)',
          }}
        />

        {/* Premium Column */}
        <div className="pkg-col pkg-col--premium">
          {/* Package tier indicator */}
          <div className="flex justify-center mb-3">
            <div
              className="silver-gradient-border inline-flex items-center rounded-full px-4 py-1.5"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <span
                className="text-xs font-medium"
                style={{
                  color: 'white',
                  fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                }}
              >
                Premium
              </span>
            </div>
          </div>

          {/* Icons row */}
          <div className="flex justify-center space-x-3 mb-3">
            <div
              className="silver-gradient-border flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <ChevronRight className="w-4 h-4 text-white/60" strokeWidth={1.5} />
              {renderLeaves(2)}
            </div>
            <div
              className="silver-gradient-border flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              {renderArrows(2)}
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-white text-center text-lg font-semibold mb-1"
            style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
          >
            FUE Saffier / DHI
          </h3>

          {/* Subtitle */}
          <p
            className="text-center text-xs mb-3"
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
            }}
          >
            V6 Hairboost®
          </p>
        </div>

        {/* Vertical Separator 2 */}
        <div
          className="v-sep"
          aria-hidden="true"
          style={{
            width: '1px',
            height: '100%',
            background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.2) 50%, transparent)',
          }}
        />

        {/* Advanced Column */}
        <div className="pkg-col pkg-col--advanced">
          {/* Package tier indicator */}
          <div className="flex justify-center mb-3">
            <div
              className="silver-gradient-border inline-flex items-center rounded-full px-4 py-1.5"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <span
                className="text-xs font-medium"
                style={{
                  color: 'white',
                  fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                }}
              >
                Advanced
              </span>
              <span
                className="ml-2 text-[8px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: 'white',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
                }}
              >
                New
              </span>
            </div>
          </div>

          {/* Icons row */}
          <div className="flex justify-center space-x-3 mb-3">
            <div
              className="silver-gradient-border flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <ChevronRight className="w-4 h-4 text-white/60" strokeWidth={1.5} />
              {renderLeaves(3)}
            </div>
            <div
              className="silver-gradient-border flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              {renderArrows(3)}
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-white text-center text-lg font-semibold mb-1"
            style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
          >
            FUE Saffier / DHI
          </h3>

          {/* Subtitle */}
          <p
            className="text-center text-xs mb-3"
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
            }}
          >
            V6 Hairboost® + GHI Stemcell repair™
          </p>
        </div>
      </div>

      {/* Read more button - outside the row, spans full width */}
      <div className="px-4 pb-4">
        <a
          href="#packages-standard"
          className="block w-full py-2 px-4 rounded-2xl text-center transition-all duration-200 text-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            color: 'white',
            fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.20)';
          }}
        >
          {language === 'nl' ? 'Lees meer' : 'Read more'}
        </a>
      </div>

      <style>{`
        .packages-block {
          position: relative;
          border-radius: 28px;
        }

        .gold-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(180deg,
            #DDB961 0%,
            #E3C06B 25%,
            #EFECE6 50%,
            #EFCF7C 75%,
            #D8AF58 100%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .packages-block > * {
          position: relative;
          z-index: 1;
        }

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
      `}</style>
    </div>
  );
};
