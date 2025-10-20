import { useLanguage } from '@/hooks/useLanguage';

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
        padding: 'clamp(1rem, 2vw, 1.5rem)',
      }}
    >
      {/* Missions Grid */}
      <div
        className="missions-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 'clamp(0.5rem, 1vw, 1rem)',
          position: 'relative',
          marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
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
              borderRadius: '18px',
              aspectRatio: '640 / 800',
              minHeight: 'clamp(200px, 30vh, 320px)',
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
                left: '12px',
                right: '12px',
                bottom: '12px',
                textAlign: 'left',
                lineHeight: 1.25,
                color: 'white',
                fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
                fontWeight: 300,
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
          className="profile-photo"
          src="https://i.pravatar.cc/120?img=12"
          alt="Berkant Dural"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        />
        <div className="profile-text">
          <strong
            className="profile-name"
            style={{
              display: 'block',
              color: 'white',
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
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
              fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
              fontWeight: 600,
            }}
          >
            CEO
          </span>
        </div>
      </footer>
    </section>
  );
};
