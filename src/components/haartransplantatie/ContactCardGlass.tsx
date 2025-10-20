interface ContactCardGlassProps {
  className?: string;
}

export const ContactCardGlass = ({ className = '' }: ContactCardGlassProps) => {
  return (
    <section
      className={`contact-card gold-gradient-border relative rounded-3xl transition-all duration-500 ${className}`}
      aria-label="Contact information"
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
      {/* Content Grid */}
      <div
        className="contact-grid"
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

        {/* Empty Tiles */}
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            className="contact-tile"
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: idx === 0 ? '23px 0 0 0' : idx === 2 ? '0 23px 0 0' : '0',
              height: '140px',
              width: '100%',
              background: idx === 0 ? '#3B454D' : idx === 1 ? '#4B555E' : '#3B454D',
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <footer
        className="contact-footer profile-glow profile-border-top"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '6px 0px 9px',
          position: 'relative',
        }}
      >
        {/* Empty footer content */}
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
