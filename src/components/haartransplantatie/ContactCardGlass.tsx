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
        padding: '16px 12px 0',
      }}
    >
      {/* Tabs */}
      <div className="contact-tabs" role="tablist" aria-label="Country" style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', marginBottom: '14px' }}>
        <button
          className={`tab ${activeTab === 'nl' ? 'is-active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'nl'}
          onClick={() => setActiveTab('nl')}
          style={{
            appearance: 'none',
            background: 'none',
            border: 0,
            padding: '4px 12px',
            fontWeight: activeTab === 'nl' ? 700 : 400,
            fontSize: 'clamp(16px, 2.8vw, 22px)',
            color: activeTab === 'nl' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
            textDecoration: activeTab === 'nl' ? 'underline' : 'none',
            textUnderlineOffset: '4px',
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
            padding: '4px 12px',
            fontWeight: activeTab === 'tr' ? 700 : 400,
            fontSize: 'clamp(16px, 2.8vw, 22px)',
            color: activeTab === 'tr' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
            textDecoration: activeTab === 'tr' ? 'underline' : 'none',
            textUnderlineOffset: '4px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          Turkije
        </button>
      </div>

      {/* NL content */}
      <div className="contact-pane" data-pane="nl" hidden={activeTab !== 'nl'} aria-labelledby="tab-nl">
        <div className="locations" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'start' }}>
          {/* Barendrecht */}
          <article className="loc" style={{ textAlign: 'center' }}>
            <div className="loc-icons" style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '6px' }}>
              <ShieldIcon className="w-4 h-4 opacity-95" />
              <div className="v6-badge" style={{ width: '16px', height: '16px', border: '1.5px solid rgba(255,255,255,0.8)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>V6</div>
            </div>
            <h2 className="city" style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(20px, 4vw, 36px)' }}>Barendrecht</h2>
            <p className="addr" style={{ margin: '.2rem 0 .6rem', fontSize: 'clamp(12px, 1.8vw, 16px)', opacity: .95 }}>Pesetastraat 72, 2991 XT</p>
            <span className="badge" style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '999px', background: 'rgba(255,255,255,0.15)', fontSize: '11px' }}>Hoofdvestiging</span>
          </article>

          {/* Leiden */}
          <article className="loc" style={{ textAlign: 'center' }}>
            <div className="loc-icons" style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '6px' }}>
              <div className="v6-badge" style={{ width: '16px', height: '16px', border: '1.5px solid rgba(255,255,255,0.8)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>V6</div>
            </div>
            <h2 className="city" style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(20px, 4vw, 36px)' }}>Leiden</h2>
            <p className="addr" style={{ margin: '.2rem 0 .6rem', fontSize: 'clamp(12px, 1.8vw, 16px)', opacity: .95 }}>Fruitweg 22, 2321 GK</p>
          </article>
        </div>

        {/* Info row */}
        <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', alignItems: 'center', justifyContent: 'center', padding: '12px 0', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,.25)', textAlign: 'center' }}>
          <span className="info" style={{ fontSize: 'clamp(10px, 1.6vw, 14px)', opacity: .9 }}>Ma – Za 10:00 – 19:00</span>
          <a className="info" href="mailto:info@globalhair.nl" style={{ fontSize: 'clamp(10px, 1.6vw, 14px)', opacity: .9, textDecoration: 'none', color: 'inherit' }}>info@globalhair.nl</a>
          <a className="info" href="tel:+31696969696" style={{ fontSize: 'clamp(10px, 1.6vw, 14px)', opacity: .9, textDecoration: 'none', color: 'inherit' }}>+31 6 96969696</a>
        </div>
      </div>

      {/* TR content */}
      <div className="contact-pane" data-pane="tr" hidden={activeTab !== 'tr'} aria-labelledby="tab-tr">
        <div className="locations" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'start' }}>
          {/* Istanbul */}
          <article className="loc" style={{ textAlign: 'center' }}>
            <div className="loc-icons" style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '6px' }}>
              <div className="v6-badge" style={{ width: '16px', height: '16px', border: '1.5px solid rgba(255,255,255,0.8)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>V6</div>
            </div>
            <h2 className="city" style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(20px, 4vw, 36px)' }}>İstanbul</h2>
            <p className="addr" style={{ margin: '.2rem 0 .6rem', fontSize: 'clamp(12px, 1.8vw, 16px)', opacity: .95 }}>Placeholder street 123, İstanbul</p>
          </article>

          {/* Ankara */}
          <article className="loc" style={{ textAlign: 'center' }}>
            <h2 className="city" style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(20px, 4vw, 36px)' }}>Ankara</h2>
            <p className="addr" style={{ margin: '.2rem 0 .6rem', fontSize: 'clamp(12px, 1.8vw, 16px)', opacity: .95 }}>Placeholder 45, Ankara</p>
          </article>
        </div>

        {/* Info row */}
        <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', alignItems: 'center', justifyContent: 'center', padding: '12px 0', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,.25)', textAlign: 'center' }}>
          <span className="info" style={{ fontSize: 'clamp(10px, 1.6vw, 14px)', opacity: .9 }}>Mon – Sat 10:00 – 19:00</span>
          <a className="info" href="mailto:info@globalhair.nl" style={{ fontSize: 'clamp(10px, 1.6vw, 14px)', opacity: .9, textDecoration: 'none', color: 'inherit' }}>info@globalhair.nl</a>
          <a className="info" href="tel:+31696969696" style={{ fontSize: 'clamp(10px, 1.6vw, 14px)', opacity: .9, textDecoration: 'none', color: 'inherit' }}>+31 6 96969696</a>
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
          gap: '18px',
          padding: '12px 0 12px',
          borderTop: '1px solid rgba(255,255,255,.2)',
          marginTop: '12px',
        }}
      >
        <button className="cta-ico" aria-label="Chat" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.5)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
          <MessageCircle size={18} color="rgba(255,255,255,0.9)" />
        </button>
        <a className="cta-ico" aria-label="WhatsApp" href="https://wa.me/31696969696" target="_blank" rel="noopener" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.5)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          <CustomWhatsAppIcon className="w-5 h-5" />
        </a>
        <a className="cta-ico" aria-label="Instagram" href="https://instagram.com/yourhandle" target="_blank" rel="noopener" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.5)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          <CustomInstagramIcon className="w-5 h-5" />
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
