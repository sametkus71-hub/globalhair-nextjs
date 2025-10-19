import { useLanguage } from '@/hooks/useLanguage';
import chevronRightIcon from '@/assets/chevron-right.svg';
import leafIcon from '@/assets/leaf.svg';

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

  const renderActiveLeaves = (count: number) => {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <img
            key={i}
            src={leafIcon}
            alt=""
            style={{ width: '.8rem', height: '.8rem' }}
          />
        ))}
      </>
    );
  };

  const renderActiveArrows = (count: number) => {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <img
            key={i}
            src={chevronRightIcon}
            alt=""
            style={{
              width: '.8rem',
              height: '.8rem',
              ...(i % 2 === 1 ? { marginLeft: '-7px' } : {})
            }}
          />
        ))}
      </>
    );
  };

  return (
    <div
      className={`packages-card gold-gradient-border relative rounded-3xl transition-all duration-500 ${className || ''}`}
      id="packages-static"
      style={{
        marginTop: 'clamp(0.25rem, 0.5vh, 0.5rem)',
        background: 'linear-gradient(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.17))',
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
        marginLeft: '.1rem',
        marginRight: '.1rem',
      }}
    >
      {/* Shared 5-track grid for pill and content */}
      <div
        className="pkg-grid"
        style={{
          paddingTop: 'clamp(0.7rem, 1vh, 1rem)',
          paddingLeft: 'clamp(0.7rem, 1vw, 1rem)',
          paddingRight: 'clamp(0.7rem, 1vw, 1rem)',
          paddingBottom: 'clamp(0.7rem, 1vw, 1rem)',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr auto 1fr',
          alignItems: 'start',
        }}
      >
        {/* Pill outer spans full width */}
        <div
          className="pill-outer"
          style={{
            gridColumn: '1 / -1',
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
          }}
        >
          {/* Pill inner aligns to the same 5 tracks */}
          <div
            className="pill-inner silver-gradient-border"
            role="group"
            aria-label="Packages"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr auto 1fr',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: '9999px',
              padding: '2px 0px',
            }}
          >
            <span className="seg seg--standard flex items-center justify-center px-4 py-1.5" style={{ position: 'relative' }}>
              <span
                className="seg-label seg-label-glow text-xs font-medium"
                style={{
                  color: 'white',
                  fontFamily: 'Inter',
                  fontWeight: 300,
                }}
              >
                Standard
              </span>
            </span>
            <span
              className="pill-divider"
              aria-hidden="true"
              style={{
                width: '1px',
                height: '60%',
                background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.35), transparent)',
              }}
            ></span>
            <span className="seg seg--premium flex items-center justify-center px-4 py-1.5" style={{ position: 'relative' }}>
              <span
                className="seg-label seg-label-glow text-xs font-medium"
                style={{
                  color: 'white',
                  fontFamily: 'Inter',
                  fontWeight: 300,
                }}
              >
                Premium
              </span>
            </span>
            <span
              className="pill-divider"
              aria-hidden="true"
              style={{
                width: '1px',
                height: '60%',
                background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.35), transparent)',
              }}
            ></span>
            <span className="seg seg--advanced flex items-center justify-center py-1.5" style={{ position: 'relative' }}>
              <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span
                  className="seg-label seg-label-glow text-xs font-medium"
                  style={{
                    color: 'white',
                    fontFamily: 'Inter',
                    fontWeight: 300,
                  }}
                >
                  Advanced
                </span>
                <span
                  className="badge-new text-[8px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgb(201, 169, 97) 20%, rgb(239, 236, 230) 50%, rgb(201, 169, 97) 80%)',
                    color: '#1a1a1a',
                    fontWeight: 600,
                    fontSize: '7px',
                    padding: '.05rem .3rem',
                    boxShadow: '0 2px 8px rgba(201, 169, 97, 0.4)',
                    pointerEvents: 'none',
                  }}
                >
                  New
                </span>
              </span>
            </span>
          </div>
        </div>

        {/* Standard Column */}
        <div className="col col--standard">
          {/* Chip row */}
          <div
            className="chiprow flex justify-center"
            style={{ 
              gap: '.2rem',
              marginBottom: 'clamp(0.75rem, 1.5vh, 1.25rem)',
            }}
          >
            <div
              className="silver-grey-gradient-border flex items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%)',
                padding: '.5rem',
                borderRadius: '.4rem',
              }}
            >
              {renderActiveArrows(1)}
            </div>
            <div
              className="silver-grey-gradient-border flex items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%)',
                padding: '.5rem',
                borderRadius: '.4rem',
              }}
            >
              {renderActiveLeaves(1)}
            </div>
          </div>

          {/* Title */}
          <p
            className="pkg-title text-white text-center"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif', 
              fontWeight: 300, 
              fontSize: 'clamp(8px, 1vh, 10px)',
              marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)',
            }}
          >
            FUE Saffier
          </p>
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
        <div className="col col--premium">
          {/* Chip row */}
          <div
            className="chiprow flex justify-center"
            style={{ 
              gap: '.2rem',
              marginBottom: 'clamp(0.75rem, 1.5vh, 1.25rem)',
            }}
          >
            <div
              className="silver-grey-gradient-border flex items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%)',
                padding: '.3rem',
                borderRadius: '.4rem',
                gap: '0.1rem',
              }}
            >
              {renderActiveArrows(2)}
            </div>
            <div
              className="silver-grey-gradient-border flex items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%)',
                padding: '.5rem',
                borderRadius: '.4rem',
              }}
            >
              {renderActiveLeaves(2)}
            </div>
          </div>

          {/* Title */}
          <p
            className="pkg-title text-white text-center"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif', 
              fontWeight: 300, 
              fontSize: 'clamp(8px, 1vh, 10px)',
              marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)',
            }}
          >
            FUE Saffier / DHI
          </p>

          {/* Lines */}
          <p
            className="text-center"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif', 
              fontWeight: 300, 
              fontSize: 'clamp(8px, 1vh, 10px)', 
              color: 'rgba(255, 255, 255, 0.85)' 
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
        <div className="col col--advanced">
          {/* Chip row */}
          <div
            className="chiprow flex justify-center"
            style={{ 
              gap: '.2rem',
              marginBottom: 'clamp(0.75rem, 1.5vh, 1.25rem)',
            }}
          >
            <div
              className="silver-grey-gradient-border flex items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%)',
                padding: '.3rem',
                borderRadius: '.4rem',
                gap: '0.1rem',
              }}
            >
              {renderActiveArrows(2)}
            </div>
            <div
              className="silver-grey-gradient-border flex items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%)',
                padding: '.5rem',
                borderRadius: '.4rem',
              }}
            >
              {renderActiveLeaves(3)}
            </div>
          </div>

          {/* Title */}
          <p
            className="pkg-title text-white text-center"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif', 
              fontWeight: 300, 
              fontSize: 'clamp(8px, 1vh, 10px)',
              marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)',
            }}
          >
            FUE Saffier / DHI
          </p>

          {/* Lines */}
          <div className="text-center space-y-1">
            <p
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif', 
                fontWeight: 300, 
                fontSize: 'clamp(8px, 1vh, 10px)', 
                color: 'rgba(255, 255, 255, 0.85)' 
              }}
            >
              V6 Hairboost®
            </p>
            <p
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif', 
                fontWeight: 300, 
                fontSize: 'clamp(8px, 1vh, 10px)', 
                color: 'rgba(255, 255, 255, 0.85)' 
              }}
            >
              GHI Stemcell repair™
            </p>
          </div>
        </div>
      </div>

      {/* Read more link - flat text with top divider */}
      <div
        className="packages-readmore"
        style={{
          marginTop: 'clamp(0.25rem, 0.5vh, 0.625rem)',
          paddingTop: 'clamp(0.2rem, 0.4vh, 0.3rem)',
          paddingBottom: 'clamp(0.5rem, 1vh, 0.9rem)',
          textAlign: 'center',
          borderTop: '1px solid transparent',
          borderImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2)) 1',
        }}
      >
        <a
          href="#packages-standard"
          className="readmore-link"
          style={{
            color: 'white',
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 'clamp(10px, 1.2vh, 13px)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {language === 'nl' ? 'Lees meer' : 'Read more'}
        </a>
      </div>

      <style>{`
        .packages-card {
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

        .packages-card > * {
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

        .seg-label-glow {
          position: relative;
        }

        .seg-label-glow::after {
          content: "";
          position: absolute;
          top: 80%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 80%;
          border-radius: 50%;
          background: #7990A5;
          filter: blur(15px);
          opacity: 1;
          pointer-events: none;
          z-index: -1;
        }
      `}</style>
    </div>
  );
};
