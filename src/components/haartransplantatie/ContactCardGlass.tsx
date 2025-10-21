import { useState } from 'react';
import shieldIcon from '@/assets/shield-icon.svg';
import v6HairboostIcon from '@/assets/v6-hairboost.png';
import chatIcon from '@/assets/chat-icon.svg';
import whatsappIcon from '@/assets/whatsapp-icon-new.svg';
import instagramIcon from '@/assets/instagram-icon-new.svg';

interface ContactCardGlassProps {
  className?: string;
}

export const ContactCardGlass = ({ className = '' }: ContactCardGlassProps) => {
  const [activeTab, setActiveTab] = useState<'nl' | 'tr'>('nl');

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
        padding: '10px 10px 0',
        minHeight: '26vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Tabs */}
      <div className="contact-tabs" role="tablist" aria-label="Country" style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', marginBottom: '6px' }}>
        <button
          className={`tab ${activeTab === 'nl' ? 'is-active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'nl'}
          onClick={() => setActiveTab('nl')}
          style={{
            appearance: 'none',
            background: 'none',
            border: 0,
            padding: '1px 6px',
            fontWeight: activeTab === 'nl' ? 500 : 200,
            fontSize: '9px',
            color: activeTab === 'nl' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
            textDecoration: activeTab === 'nl' ? 'underline' : 'none',
            textUnderlineOffset: '2px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          Nederland
        </button>
        <button
          className={`tab ${activeTab === 'tr' ? 'is-active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'tr'}
          onClick={() => setActiveTab('tr')}
          style={{
            appearance: 'none',
            background: 'none',
            border: 0,
            padding: '1px 6px',
            fontWeight: activeTab === 'tr' ? 500 : 200,
            fontSize: '9px',
            color: activeTab === 'tr' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
            textDecoration: activeTab === 'tr' ? 'underline' : 'none',
            textUnderlineOffset: '2px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          Turkije
        </button>
      </div>

      {/* NL content */}
      <div className="contact-pane" data-pane="nl" hidden={activeTab !== 'nl'} aria-labelledby="tab-nl" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="locations" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'start', marginBottom: '1.3rem' }}>
          {/* Barendrecht */}
          <article className="loc" style={{ textAlign: 'center' }}>
            <div className="loc-icons" style={{ display: 'flex', gap: '3px', justifyContent: 'center', alignItems: 'center', marginBottom: '3px' }}>
              <img src={shieldIcon} alt="Shield" style={{ width: '12px', height: '12px', opacity: 0.95 }} />
              <img src={v6HairboostIcon} alt="V6 Hairboost" style={{ width: '18px', height: '18px' }} />
            </div>
            <h2 className="city" style={{ margin: 0, fontWeight: 400, fontSize: '13px', color: 'rgba(255,255,255,0.95)' }}>Barendrecht</h2>
            <p className="addr" style={{ margin: '0.05rem 0px -0.2rem', fontSize: '7.5px', color: 'rgba(255,255,255,0.95)' }}>Pesetastraat 72, 2991 XT</p>
            <span className="badge silver-grey-gradient-border" style={{ display: 'inline-block', padding: '3px 6px', borderRadius: '999px', background: 'rgba(255,255,255,0.15)', fontSize: '6.5px', color: 'rgba(255,255,255,0.9)', marginTop: '-1px' }}>Hoofdvestiging</span>
          </article>

          {/* Leiden */}
          <article className="loc" style={{ textAlign: 'center' }}>
            <div className="loc-icons" style={{ display: 'flex', gap: '3px', justifyContent: 'center', alignItems: 'center', marginBottom: '3px' }}>
              <img src={v6HairboostIcon} alt="V6 Hairboost" style={{ width: '18px', height: '18px' }} />
            </div>
            <h2 className="city" style={{ margin: 0, fontWeight: 400, fontSize: '13px', color: 'rgba(255,255,255,0.95)' }}>Leiden</h2>
            <p className="addr" style={{ margin: '0.05rem 0px -0.2rem', fontSize: '7.5px', color: 'rgba(255,255,255,0.95)' }}>Fruitweg 22, 2321 GK</p>
          </article>
        </div>

        {/* Info row */}
        <div className="info-row" style={{ display: 'flex', gap: '11px', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0px 0px', marginTop: '5px', marginLeft: '30px', marginRight: '30px', borderTop: '1px solid rgba(255,255,255,.25)', textAlign: 'center' }}>
          <span className="info" style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.9)' }}>Ma – Za 10:00 – 19:00</span>
          <a className="info" href="mailto:info@globalhair.nl" style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>info@globalhair.nl</a>
          <a className="info" href="tel:+31696969696" style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>+31 6 96969696</a>
        </div>
      </div>

      {/* TR content */}
      <div className="contact-pane" data-pane="tr" hidden={activeTab !== 'tr'} aria-labelledby="tab-tr" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="locations" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.3rem' }}>
          {/* Istanbul */}
          <article className="loc" style={{ textAlign: 'center' }}>
            <div className="loc-icons" style={{ display: 'flex', gap: '3px', justifyContent: 'center', alignItems: 'center', marginBottom: '3px' }}>
              <img src={shieldIcon} alt="Shield" style={{ width: '12px', height: '12px', opacity: 0.95 }} />
              <img src={v6HairboostIcon} alt="V6 Hairboost" style={{ width: '18px', height: '18px' }} />
            </div>
            <h2 className="city" style={{ margin: 0, fontWeight: 400, fontSize: '13px', color: 'rgba(255,255,255,0.95)' }}>İstanbul</h2>
            <p className="addr" style={{ margin: '0.05rem 0px -0.2rem', fontSize: '7.5px', color: 'rgba(255,255,255,0.95)' }}>Kaynarca, Erol Kaya Cd No:204, 34890 Pendik</p>
          </article>
        </div>

        {/* Info row */}
        <div className="info-row" style={{ display: 'flex', gap: '11px', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0px 0px', marginTop: '5px', marginLeft: '30px', marginRight: '30px', borderTop: '1px solid rgba(255,255,255,.25)', textAlign: 'center' }}>
          <span className="info" style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.9)' }}>Mon – Sat 10:00 – 19:00</span>
          <a className="info" href="mailto:info@globalhair.nl" style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>info@globalhair.nl</a>
          <a className="info" href="tel:+31696969696" style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>+31 6 96969696</a>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="contact-footer profile-border-top"
        aria-label="Contact methods"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '9px 0px',
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 100%)',
          borderTop: '1px solid rgba(255,255,255,.2)',
          marginTop: 'auto',
          marginLeft: '-10px',
          marginRight: '-10px',
          width: 'calc(100% + 20px)',
        }}
      >
        <button 
          className="cta-ico silver-grey-gradient-border" 
          aria-label="Chat"
          style={{ 
            width: '28px', 
            height: '28px', 
            borderRadius: '50%', 
            background: 'rgba(255, 255, 255, 0.12)', 
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer', 
            padding: 0,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <img src={chatIcon} alt="Chat" style={{ width: '14px', height: '14px' }} />
        </button>
        <a 
          className="cta-ico silver-grey-gradient-border" 
          aria-label="WhatsApp"
          href="https://wa.me/31696969696" 
          target="_blank" 
          rel="noopener" 
          style={{ 
            width: '28px', 
            height: '28px', 
            borderRadius: '50%', 
            background: 'rgba(255, 255, 255, 0.12)', 
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <img src={whatsappIcon} alt="WhatsApp" style={{ width: '14px', height: '14px' }} />
        </a>
        <a 
          className="cta-ico silver-grey-gradient-border" 
          aria-label="Instagram"
          href="https://instagram.com/yourhandle" 
          target="_blank" 
          rel="noopener" 
          style={{ 
            width: '28px', 
            height: '28px', 
            borderRadius: '50%', 
            background: 'rgba(255, 255, 255, 0.12)', 
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <img src={instagramIcon} alt="Instagram" style={{ width: '14px', height: '14px' }} />
        </a>
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
