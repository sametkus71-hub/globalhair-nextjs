import { ChevronRight, Leaf } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface PackageCardGlassProps {
  package: 'Standard' | 'Premium' | 'Advanced';
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

export const PackageCardGlass = ({ package: pkg }: PackageCardGlassProps) => {
  const { language } = useLanguage();
  const data = packageData[pkg];

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
      className="package-card gold-gradient-border relative mx-2 mt-2 p-4 rounded-3xl transition-all duration-500"
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        animation: 'slide-fade-in 0.5s ease-out',
      }}
    >
      {/* Package tier indicator */}
      <div className="flex justify-center mb-3">
        <div
          className="silver-gradient-border inline-flex items-center rounded-full px-4 py-1.5"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
          }}
        >
          <span
            className="text-xs font-medium"
            style={{
              color: 'white',
              fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
            }}
          >
            {pkg}
          </span>
          {pkg === 'Advanced' && (
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
          )}
        </div>
      </div>

      {/* Icons row */}
      <div className="flex justify-center space-x-3 mb-3">
        {/* Growth indicator */}
        <div
          className="silver-gradient-border flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <ChevronRight className="w-4 h-4 text-white/60" strokeWidth={1.5} />
          {renderLeaves(data.growth)}
        </div>

        {/* Recovery indicator */}
        <div
          className="silver-gradient-border flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {renderArrows(data.recovery)}
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-white text-center text-lg font-semibold mb-1"
        style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
      >
        {data.title}
      </h3>

      {/* Subtitle */}
      {data.subtitle && (
        <p
          className="text-center text-xs mb-3"
          style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
          }}
        >
          {data.subtitle}
        </p>
      )}

      {/* Read more button */}
      <a
        href={data.anchor}
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

      <style>{`
        @keyframes slide-fade-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .package-card {
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

        .package-card > * {
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
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            #4B555E 0%,
            #ACB9C1 22%,
            #FFFFFF 52%,
            #ACB9C1 78%,
            #4B555E 100%
          );
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
