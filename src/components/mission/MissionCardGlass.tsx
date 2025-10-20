import { useLanguage } from '@/hooks/useLanguage';
import berkantProfile from '@/assets/berkant-profile.png';

interface MissionCardGlassProps {
  className?: string;
}

export const MissionCardGlass = ({ className = '' }: MissionCardGlassProps) => {
  const { language } = useLanguage();

  const missions = [
    {
      year: '1996',
      image: 'https://picsum.photos/640/900?1',
      caption: 'Started at 12 years old',
    },
    {
      year: '2025',
      image: 'https://picsum.photos/640/900?2',
      caption: 'Developed 6+ methods\nOpened 3 locations',
    },
    {
      year: 'future',
      image: 'https://picsum.photos/640/900?3',
      caption: '100% reverse\nglobal balding',
    },
  ];

  return (
    <section
      className={`missions-card gold-gradient-border relative rounded-3xl transition-all duration-500 ${className}`}
      aria-label="Mission timeline"
      style={{
        marginTop: 'clamp(0.25rem, 0.5vh, 0.5rem)',
        background: 'linear-gradient(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.17))',
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
        marginLeft: '.1rem',
        marginRight: '.1rem',
        padding: 0,
      }}
    >
      {/* Missions Grid */}
      <div
        className="missions-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 0,
          position: 'relative',
          margin: '0px 1px',
          paddingTop: '1px',
        }}
      >
        {/* Vertical separators */}
        <div
          style={{
            content: '',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 'calc(100% / 3)',
            width: '1px',
            background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.25), transparent)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            content: '',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 'calc(200% / 3)',
            width: '1px',
            background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.25), transparent)',
            pointerEvents: 'none',
          }}
        />

        {/* Mission Tiles */}
        {missions.map((mission, idx) => (
          <article
            key={idx}
            className="mission-tile"
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: idx === 0 ? '23px 0 0 0' : idx === 2 ? '0 23px 0 0' : '0',
              height: '140px',
              width: '100%',
            }}
          >
            <img
              className="mission-img"
              src={mission.image}
              alt={`Mission ${mission.year} placeholder`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                opacity: 0.9,
                borderRadius: idx === 0 ? '23px 0 0 0' : idx === 2 ? '0 23px 0 0' : '0',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: idx === 0 ? '23px 0 0 0' : idx === 2 ? '0 23px 0 0' : '0',
              }}
            />
            <span
              className="mission-year silver-gradient-border"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: '9999px',
                padding: '6px 16px',
                color: 'white',
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                fontWeight: 300,
                fontFamily: 'Inter',
              }}
            >
              {mission.year}
            </span>
            <h3
              className="mission-caption"
              style={{
                position: 'absolute',
                left: '5px',
                right: '2px',
                bottom: '12px',
                textAlign: 'left',
                lineHeight: 1.25,
                color: 'white',
                fontSize: 'clamp(9px, 1.5vw, 11px)',
                fontWeight: 400,
                letterSpacing: '-0.3px',
                whiteSpace: 'pre-line',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              {mission.caption}
            </h3>
          </article>
        ))}
      </div>

      {/* Profile Footer */}
      <footer
        className="missions-profile"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '14px 0 8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.28)',
        }}
      >
        <img
          className="profile-photo silver-grey-gradient-border"
          src={berkantProfile}
          alt="Berkant Dural"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
        <div className="profile-text">
          <strong
            className="profile-name"
            style={{
              display: 'block',
              color: 'white',
              fontSize: '11px',
              fontWeight: 400,
            }}
          >
            Berkant Dural
          </strong>
          <span
            className="profile-role"
            style={{
              display: 'block',
              color: 'white',
              opacity: 0.85,
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            CEO
          </span>
        </div>
      </footer>

      <style>{`
        .silver-grey-gradient-border {
          position: relative;
        }

        .silver-grey-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1.3px;
          border-radius: inherit;
          background: linear-gradient(80deg, #949494 7%, #838e94 16%, #b5b5b5 34%, #ACB9C1 51%, #4e5964 78%, #727272 105%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .silver-grey-gradient-border > * {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </section>
  );
};
