'use client';

import { ChevronRight, Leaf } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const packageData = {
  Standard: {
    title: 'FUE Saffier',
    subtitle: null,
    growth: 1,
    recovery: 1,
  },
  Premium: {
    title: 'FUE Saffier / DHI',
    subtitle: 'V6 Hairboost®',
    growth: 2,
    recovery: 2,
  },
  Elite: {
    title: 'FUE Saffier / DHI',
    subtitle: 'V6 Hairboost® + GHI Stemcell repair™',
    growth: 3,
    recovery: 3,
  },
};

export const PackageComparisonGlass = () => {
  const { language } = useLanguage();

  const renderLeaves = (count: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(count)].map((_, i) => (
          <Leaf
            key={i}
            className="w-5 h-5"
            strokeWidth={1.5}
            style={{
              color: 'rgba(74, 222, 128, 1)',
              fill: 'rgba(74, 222, 128, 0.3)',
            }}
          />
        ))}
      </div>
    );
  };

  const renderArrows = (count: number) => {
    return (
      <div className="flex">
        {[...Array(count)].map((_, i) => (
          <ChevronRight
            key={i}
            className="w-5 h-5 -mr-1"
            strokeWidth={2.5}
            style={{
              color: 'rgba(96, 165, 250, 1)',
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="px-2 py-4">
      <div
        className="package-comparison-container relative rounded-[32px] p-4"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          animation: 'slide-fade-in 0.5s ease-out',
        }}
      >
        {/* Package selector at top */}
        <div className="flex justify-center mb-6">
          <div
            className="inline-flex items-center rounded-full p-1"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.20)',
            }}
          >
            {Object.keys(packageData).map((pkg) => (
              <div
                key={pkg}
                className="relative px-6 py-2"
              >
                <span
                  className="text-sm font-medium"
                  style={{
                    color: 'white',
                    fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                  }}
                >
                  {pkg}
                </span>
                {pkg === 'Elite' && (
                  <span
                    className="absolute -top-1 -right-1 text-[9px] px-1.5 py-0.5 rounded-full"
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
            ))}
          </div>
        </div>

        {/* Package details grid */}
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(packageData).map(([pkg, data]) => (
            <div key={pkg} className="flex flex-col items-center space-y-4">
              {/* Icons row */}
              <div className="flex space-x-2">
                {/* Growth indicator */}
                <div
                  className="flex items-center justify-center px-3 py-2 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  {renderArrows(data.recovery)}
                </div>

                {/* Recovery indicator */}
                <div
                  className="flex items-center justify-center px-3 py-2 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  {renderLeaves(data.growth)}
                </div>
              </div>

              {/* Title */}
              <h3
                className="text-white text-center text-base font-semibold"
                style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
              >
                {data.title}
              </h3>

              {/* Subtitle */}
              {data.subtitle && (
                <p
                  className="text-center text-xs px-2"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                  }}
                >
                  {data.subtitle}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slide-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .package-comparison-container {
          position: relative;
          border-radius: 32px;
        }

        .package-comparison-container::before {
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

        .package-comparison-container > * {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};
