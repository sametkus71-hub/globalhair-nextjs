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
        minHeight: '26vh',
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
                background: idx === 0 ? '#3B454D' : idx === 1 ? '#4B555E' : '#3B454D',
                opacity: 1.0,
                borderRadius: idx === 0 ? '23px 0 0 0' : idx === 2 ? '0 23px 0 0' : '0',
              }}
            />
            <span
              className="mission-year silver-grey-gradient-border"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: '9999px',
                padding: '2px 8px',
                color: 'white',
                fontSize: '9px',
                fontWeight: 200,
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
                letterSpacing: '-0.2px',
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
        className="missions-profile profile-glow profile-border-top"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '10px 0px',
          position: 'relative',
        }}
      >
        <div
          className="silver-grey-gradient-border"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            overflow: 'hidden',
          }}
        >
          <img
            className="profile-photo"
            src={berkantProfile}
            alt="Berkant Dural"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
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
          padding: 1.6px;
          border-radius: inherit;
          background: linear-gradient(80deg, #949494 7%, #838e94 16%, #b5b5b5 34%, #ACB9C1 51%, #4e5964 78%, #727272 105%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 3;
        }

        .silver-grey-gradient-border > * {
          position: relative;
          z-index: 1;
        }

        .profile-glow::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70%;
          height: 70%;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          filter: blur(40px);
          opacity: 1;
          z-index: -1;
          pointer-events: none;
        }

        .profile-border-top::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(80deg, #949494 7%, #838e94 16%, #b5b5b5 34%, #ACB9C1 51%, #4e5964 78%, #727272 105%);
          z-index: 3;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
};
