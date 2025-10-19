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
            className="w-4 h-4"
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
            className="w-4 h-4"
            style={i % 2 === 1 ? { marginLeft: '-7px' } : undefined}
          />
        ))}
      </>
    );
  };

  return (
    <div
      className={`packages-card gold-gradient-border relative mt-2 rounded-3xl transition-all duration-500 ${className || ''}`}
      id="packages-static"
      style={{
        background: 'linear-gradient(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.17))',
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
        marginLeft: '.1rem',
        marginRight: '.1rem',
      }}
    >
      {/* Top tier pill */}
      <div className="packages-top pt-4 px-4">
        <div className="tier-pill" aria-label="Packages">
          <span className="seg">
            <span className="seg-label">Standard</span>
          </span>
          <span className="divider" aria-hidden="true"></span>
          <span className="seg">
            <span className="seg-label">Premium</span>
          </span>
          <span className="divider" aria-hidden="true"></span>
          <span className="seg">
            <span className="seg-label">Advanced</span>
            <em className="badge-new">New</em>
          </span>
        </div>
      </div>

      {/* Three columns with vertical dividers */}
      <div
        className="packages-grid p-4"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1px 1fr 9px 1fr',
          alignItems: 'start',
        }}
      >
        {/* Standard Column */}
        <div className="pkg-col pkg-col--standard">
          {/* Chip row */}
          <div
            className="chiprow flex justify-center mb-3"
            style={{ gap: '.2rem' }}
          >
            <div
              className="silver-gradient-border flex items-center gap-1.5"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '.5rem',
                borderRadius: '.4rem',
              }}
            >
              {renderActiveArrows(1)}
            </div>
            <div
              className="silver-gradient-border flex items-center gap-1.5"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '.5rem',
                borderRadius: '.4rem',
              }}
            >
              {renderActiveLeaves(1)}
            </div>
          </div>

          {/* Title */}
          <p
            className="pkg-title text-white text-center mb-2"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 300, fontSize: '10px' }}
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
        <div className="pkg-col pkg-col--premium">
          {/* Chip row */}
          <div
            className="chiprow flex justify-center mb-3"
            style={{ gap: '.2rem' }}
          >
            <div
              className="silver-gradient-border flex items-center"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '.3rem',
                borderRadius: '.4rem',
                gap: '0.1rem',
              }}
            >
              {renderActiveArrows(2)}
            </div>
            <div
              className="silver-gradient-border flex items-center"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '.5rem',
                borderRadius: '.4rem',
              }}
            >
              {renderActiveLeaves(2)}
            </div>
          </div>

          {/* Title */}
          <p
            className="pkg-title text-white text-center mb-2"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 300, fontSize: '10px' }}
          >
            FUE Saffier / DHI
          </p>

          {/* Lines */}
          <p
            className="text-center"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 300, fontSize: '10px', color: 'rgba(255, 255, 255, 0.85)' }}
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
          {/* Chip row */}
          <div
            className="chiprow flex justify-center mb-3"
            style={{ gap: '.2rem' }}
          >
            <div
              className="silver-gradient-border flex items-center"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '.3rem',
                borderRadius: '.4rem',
                gap: '0.1rem',
              }}
            >
              {renderActiveArrows(2)}
            </div>
            <div
              className="silver-gradient-border flex items-center"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '.5rem',
                borderRadius: '.4rem',
              }}
            >
              {renderActiveLeaves(3)}
            </div>
          </div>

          {/* Title */}
          <p
            className="pkg-title text-white text-center mb-2"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 300, fontSize: '10px' }}
          >
            FUE Saffier / DHI
          </p>

          {/* Lines */}
          <div className="text-center space-y-1">
            <p
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 300, fontSize: '10px', color: 'rgba(255, 255, 255, 0.85)' }}
            >
              V6 Hairboost®
            </p>
            <p
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 300, fontSize: '10px', color: 'rgba(255, 255, 255, 0.85)' }}
            >
              GHI Stemcell repair™
            </p>
          </div>
        </div>
      </div>

      {/* Read more button - outside the grid, spans full width */}
      <div className="packages-readmore px-4 pb-4">
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

        .tier-pill {
          display: grid;
          grid-template-columns: 1fr 1px 1fr 1px 1fr;
          align-items: center;
          gap: 0;
          height: 56px;
          padding: 4px;
          border-radius: 9999px;
          background:
            linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.05)) padding-box,
            linear-gradient(180deg, #4B555E 0%, #ACB9C1 22%, #FFFFFF 52%, #ACB9C1 78%, #4B555E 100%) border-box;
          border: 1px solid transparent;
          background-clip: padding-box, border-box;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .tier-pill .seg {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          border-radius: 9999px;
          padding: 0 18px;
        }

        .tier-pill .seg-label {
          color: #fff;
          font: 700 18px/1 "Inter", system-ui;
        }

        .tier-pill .divider {
          width: 1px;
          height: 60%;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,.35), transparent);
        }

        .tier-pill .badge-new {
          margin-left: 10px;
          font: 800 11px/1 "Inter";
          color: #1b2b36;
          padding: 6px 8px;
          border-radius: 9999px;
          background: linear-gradient(180deg, #ffe3a8, #efc96f);
          border: 1px solid rgba(0,0,0,.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.75), 0 2px 6px rgba(0,0,0,.15);
          font-style: normal;
        }
      `}</style>
    </div>
  );
};
