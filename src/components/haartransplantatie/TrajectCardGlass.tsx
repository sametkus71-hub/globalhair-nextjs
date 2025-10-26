import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface TrajectCardGlassProps {
  className?: string;
}

export const TrajectCardGlass = ({ className = '' }: TrajectCardGlassProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleMethodsClick = () => {
    navigate(language === 'nl' ? '/nl/haartransplantatie/nl/standard' : '/en/hair-transplant/en/standard');
  };

  return (
    <section
      className={`traject-card gold-gradient-border relative rounded-3xl transition-all duration-500 ${className}`}
      aria-label="Trajectory information"
      style={{
        marginTop: 'clamp(0.25rem, 0.5vh, 0.5rem)',
        background: 'linear-gradient(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.17))',
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
        marginLeft: '.1rem',
        marginRight: '.1rem',
        padding: '10px 10px 0',
        minHeight: '26vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Empty content area for now */}
      <div style={{ flex: 1 }} />

      {/* Footer */}
      <footer
        className="traject-footer profile-border-top"
        aria-label="Navigation"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '9px 0px',
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.03) 100%)',
          marginTop: 'auto',
          marginLeft: '-10px',
          marginRight: '-10px',
          width: 'calc(100% + 20px)',
        }}
      >
        <button 
          onClick={handleMethodsClick}
          className="methods-link"
          style={{ 
            background: 'none',
            border: 'none',
            color: 'white',
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 'clamp(10px, 1.2vh, 13px)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            cursor: 'pointer',
            padding: 0,
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {language === 'nl' ? 'Methodes' : 'Methods'}
        </button>
      </footer>

      <style>{`
        .gold-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(130deg,
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

        .traject-card > * {
          position: relative;
          z-index: 1;
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
