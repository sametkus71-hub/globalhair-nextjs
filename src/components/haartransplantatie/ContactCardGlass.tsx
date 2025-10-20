import { useState } from 'react';
import { ShieldIcon } from '@/components/logos/ShieldIcon';
import { MessageCircle } from 'lucide-react';
import { CustomWhatsAppIcon } from '@/components/icons/CustomWhatsAppIcon';
import { CustomInstagramIcon } from '@/components/icons/CustomInstagramIcon';

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
        padding: '24px 16px 0',
      }}
    >
      {/* Tabs */}
      <div className="contact-tabs" role="tablist" aria-label="Country" style={{ display: 'flex', gap: '18px', justifyContent: 'center', alignItems: 'center', marginBottom: '22px' }}>
        <button
          className={`tab ${activeTab === 'nl' ? 'is-active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'nl'}
          onClick={() => setActiveTab('nl')}
          style={{
            appearance: 'none',
            background: 'none',
            border: 0,
            padding: '8px 18px',
            fontWeight: activeTab === 'nl' ? 700 : 400,
            fontSize: 'clamp(20px, 3.5vw, 32px)',
            color: activeTab === 'nl' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
            textDecoration: activeTab === 'nl' ? 'underline' : 'none',
            textUnderlineOffset: '6px',
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
            padding: '8px 18px',
            fontWeight: activeTab === 'tr' ? 700 : 400,
            fontSize: 'clamp(20px, 3.5vw, 32px)',
            color: activeTab === 'tr' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
            textDecoration: activeTab === 'tr' ? 'underline' : 'none',
            textUnderlineOffset: '6px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          Turkije
        </button>
      </div>

      {/* NL content */}
      <div className="contact-pane" data-pane="nl" hidden={activeTab !== 'nl'} aria-labelledby="tab-nl">
        <div className="locations" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Barendrecht */}
          <article className="loc" style={{ textAlign: 'center' }}>
            <div className="loc-icons" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '8px' }}>
              <ShieldIcon className="w-6 h-6 opacity-95" />
              <div className="v6-badge" style={{ width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.8)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>V6</div>
            </div>
            <h2 className="city" style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(28px, 5vw, 56px)' }}>Barendrecht</h2>
            <p className="addr" style={{ margin: '.35rem 0 1rem', fontSize: 'clamp(16px, 2.2vw, 24px)', opacity: .95 }}>Pesetastraat 72, 2991 XT</p>
            <span className="badge" style={{ display: 'inline-block', padding: '8px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.15)', fontSize: '14px' }}>Hoofdvestiging</span>
          </article>

          {/* Leiden */}
          <article className="loc" style={{ textAlign: 'center' }}>
            <div className="loc-icons" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '8px' }}>
              <div className="v6-badge" style={{ width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.8)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>V6</div>
            </div>
            <h2 className="city" style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(28px, 5vw, 56px)' }}>Leiden</h2>
            <p className="addr" style={{ margin: '.35rem 0 1rem', fontSize: 'clamp(16px, 2.2vw, 24px)', opacity: .95 }}>Fruitweg 22, 2321 GK</p>
          </article>
        </div>

        {/* Info row */}
        <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', alignItems: 'center', justifyContent: 'center', padding: '18px 0', marginTop: '18px', borderTop: '1px solid rgba(255,255,255,.25)', textAlign: 'center' }}>
          <span className="info" style={{ fontSize: 'clamp(14px, 2vw, 18px)', opacity: .9 }}>Ma – Za 10:00 – 19:00</span>
          <a className="info" href="mailto:info@globalhair.nl" style={{ fontSize: 'clamp(14px, 2vw, 18px)', opacity: .9, textDecoration: 'none', color: 'inherit' }}>info@globalhair.nl</a>
          <a className="info" href="tel:+31696969696" style={{ fontSize: 'clamp(14px, 2vw, 18px)', opacity: .9, textDecoration: 'none', color: 'inherit' }}>+31 6 96969696</a>
        </div>
      </div>

      {/* TR content */}
      <div className="contact-pane" data-pane="tr" hidden={activeTab !== 'tr'} aria-labelledby="tab-tr">
        <div className="locations" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Istanbul */}
          <article className="loc" style={{ textAlign: 'center' }}>
            <div className="loc-icons" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '8px' }}>
              <div className="v6-badge" style={{ width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.8)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>V6</div>
            </div>
            <h2 className="city" style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(28px, 5vw, 56px)' }}>İstanbul</h2>
            <p className="addr" style={{ margin: '.35rem 0 1rem', fontSize: 'clamp(16px, 2.2vw, 24px)', opacity: .95 }}>Placeholder street 123, İstanbul</p>
          </article>

          {/* Ankara */}
          <article className="loc" style={{ textAlign: 'center' }}>
            <h2 className="city" style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(28px, 5vw, 56px)' }}>Ankara</h2>
            <p className="addr" style={{ margin: '.35rem 0 1rem', fontSize: 'clamp(16px, 2.2vw, 24px)', opacity: .95 }}>Placeholder 45, Ankara</p>
          </article>
        </div>

        {/* Info row */}
        <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', alignItems: 'center', justifyContent: 'center', padding: '18px 0', marginTop: '18px', borderTop: '1px solid rgba(255,255,255,.25)', textAlign: 'center' }}>
          <span className="info" style={{ fontSize: 'clamp(14px, 2vw, 18px)', opacity: .9 }}>Mon – Sat 10:00 – 19:00</span>
          <a className="info" href="mailto:info@globalhair.nl" style={{ fontSize: 'clamp(14px, 2vw, 18px)', opacity: .9, textDecoration: 'none', color: 'inherit' }}>info@globalhair.nl</a>
          <a className="info" href="tel:+31696969696" style={{ fontSize: 'clamp(14px, 2vw, 18px)', opacity: .9, textDecoration: 'none', color: 'inherit' }}>+31 6 96969696</a>
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
          gap: '28px',
          padding: '18px 0 16px',
          borderTop: '1px solid rgba(255,255,255,.2)',
          marginTop: '18px',
        }}
      >
        <button className="cta-ico" aria-label="Chat" style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.5)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
          <MessageCircle size={24} color="rgba(255,255,255,0.9)" />
        </button>
        <a className="cta-ico" aria-label="WhatsApp" href="https://wa.me/31696969696" target="_blank" rel="noopener" style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.5)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          <CustomWhatsAppIcon className="w-6 h-6" />
        </a>
        <a className="cta-ico" aria-label="Instagram" href="https://instagram.com/yourhandle" target="_blank" rel="noopener" style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.5)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          <CustomInstagramIcon className="w-6 h-6" />
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
