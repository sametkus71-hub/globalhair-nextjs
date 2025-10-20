import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';

interface MissionCardGlassProps {
  className?: string;
}

export const MissionCardGlass = ({ className = '' }: MissionCardGlassProps) => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const timelineData = {
    nl: {
      periods: ['1996', '2025', 'toekomst'],
      content: {
        '1996': ['Gestart op', '12-jarige leeftijd'],
        '2025': ['Ontwikkeld 6+ methodes', 'Geopend 3 locaties'],
        'toekomst': ['100% omkering', 'wereldwijde kaalheid'],
      }
    },
    en: {
      periods: ['1996', '2025', 'future'],
      content: {
        '1996': ['Started at', '12 years old'],
        '2025': ['Developed 6+ methods', 'Opened 3 locations'],
        'future': ['100% reverse', 'global balding'],
      }
    }
  };

  const data = language === 'nl' ? timelineData.nl : timelineData.en;

  return (
    <div
      className={`mission-card gold-gradient-border relative rounded-3xl transition-all duration-500 ${className}`}
      style={{
        marginTop: 'clamp(0.25rem, 0.5vh, 0.5rem)',
        background: 'linear-gradient(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.17))',
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
        marginLeft: '.1rem',
        marginRight: '.1rem',
      }}
    >
      {/* Grid container */}
      <div
        className="mission-grid"
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
        {/* Timeline pill selector */}
        <div
          className="pill-outer"
          style={{
            gridColumn: '1 / -1',
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
          }}
        >
          <div
            className="pill-inner silver-gradient-border"
            role="group"
            aria-label="Timeline"
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
            <span className="seg flex items-center justify-center px-4 py-1.5" style={{ position: 'relative' }}>
              <span
                className="seg-label seg-label-glow text-xs font-medium"
                style={{
                  color: 'white',
                  fontFamily: 'Inter',
                  fontWeight: 300,
                }}
              >
                {data.periods[0]}
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
            <span className="seg flex items-center justify-center px-4 py-1.5" style={{ position: 'relative' }}>
              <span
                className="seg-label seg-label-glow text-xs font-medium"
                style={{
                  color: 'white',
                  fontFamily: 'Inter',
                  fontWeight: 300,
                }}
              >
                {data.periods[1]}
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
            <span className="seg flex items-center justify-center px-4 py-1.5" style={{ position: 'relative' }}>
              <span
                className="seg-label seg-label-glow text-xs font-medium"
                style={{
                  color: 'white',
                  fontFamily: 'Inter',
                  fontWeight: 300,
                }}
              >
                {data.periods[2]}
              </span>
            </span>
          </div>
        </div>

        {/* Content columns */}
        <div
          className="content-col"
          style={{
            gridColumn: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.5rem, 1vh, 0.75rem)',
            minHeight: 'clamp(200px, 30vh, 280px)',
          }}
        >
          {data.content['1996'].map((text, idx) => (
            <p
              key={idx}
              className="text-white/90 text-center"
              style={{
                fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
                fontWeight: 300,
                lineHeight: 1.4,
              }}
            >
              {text}
            </p>
          ))}
        </div>

        <div
          className="col-divider"
          style={{
            gridColumn: '2',
            width: '1px',
            height: '100%',
            background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
          }}
        ></div>

        <div
          className="content-col"
          style={{
            gridColumn: '3',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.5rem, 1vh, 0.75rem)',
            minHeight: 'clamp(200px, 30vh, 280px)',
          }}
        >
          {data.content['2025'].map((text, idx) => (
            <p
              key={idx}
              className="text-white/90 text-center"
              style={{
                fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
                fontWeight: 300,
                lineHeight: 1.4,
              }}
            >
              {text}
            </p>
          ))}
        </div>

        <div
          className="col-divider"
          style={{
            gridColumn: '4',
            width: '1px',
            height: '100%',
            background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
          }}
        ></div>

        <div
          className="content-col"
          style={{
            gridColumn: '5',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.5rem, 1vh, 0.75rem)',
            minHeight: 'clamp(200px, 30vh, 280px)',
          }}
        >
          {data.content[language === 'nl' ? 'toekomst' : 'future'].map((text, idx) => (
            <p
              key={idx}
              className="text-white/90 text-center"
              style={{
                fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
                fontWeight: 300,
                lineHeight: 1.4,
              }}
            >
              {text}
            </p>
          ))}
        </div>

        {/* Profile section at bottom */}
        <div
          className="profile-section"
          style={{
            gridColumn: '1 / -1',
            marginTop: 'clamp(1rem, 2vh, 1.5rem)',
            paddingTop: 'clamp(1rem, 2vh, 1.5rem)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.75rem, 1.5vw, 1rem)',
          }}
        >
          <div
            className="profile-avatar"
            style={{
              width: 'clamp(40px, 6vw, 56px)',
              height: 'clamp(40px, 6vw, 56px)',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
            }}
          >
            {/* Placeholder for profile image */}
            <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5"></div>
          </div>
          <div className="profile-info">
            <p
              className="text-white font-medium"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                fontWeight: 400,
                marginBottom: '0.125rem',
              }}
            >
              Berkant Dural
            </p>
            <p
              className="text-white/70"
              style={{
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                fontWeight: 300,
              }}
            >
              CEO
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
