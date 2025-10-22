import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const PackageStandardPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeCountry, setActiveCountry] = useState<'nl' | 'tr'>('nl');
  const [activeTier, setActiveTier] = useState<'Standard' | 'Premium' | 'Advanced'>('Standard');

  const handleClose = () => {
    navigate(`/${language}/haartransplantatie`);
  };

  return (
    <main className="pkg-std min-h-screen flex flex-col justify-between px-3 pt-4 pb-24 bg-[#0a0f1a]">
      <section className="glass-card relative rounded-[28px] p-4 pb-6 backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="btn-close absolute top-2.5 left-3 bg-transparent border-0 text-white/80 hover:text-white text-[28px] leading-none p-2"
          aria-label="Close"
        >
          <X className="w-7 h-7" strokeWidth={2} />
        </button>

        {/* Country toggle */}
        <div className="country-toggle flex gap-2 justify-center mt-6 mb-2" role="tablist" aria-label="Country">
          <button 
            className={`ctab px-3.5 py-2 rounded-full text-sm transition-all ${
              activeCountry === 'nl' 
                ? 'bg-white/20 text-white border border-white/30' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
            onClick={() => setActiveCountry('nl')}
          >
            Nederland
          </button>
          <button 
            className={`ctab px-3.5 py-2 rounded-full text-sm transition-all ${
              activeCountry === 'tr' 
                ? 'bg-white/20 text-white border border-white/30' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
            onClick={() => setActiveCountry('tr')}
          >
            Turkije
          </button>
        </div>

        {/* Tier pill */}
        <div className="tier-pill grid grid-cols-3 gap-3 my-2.5" aria-label="Tiers">
          <button
            className={`seg text-center px-4 py-3 rounded-full text-sm transition-all ${
              activeTier === 'Standard'
                ? 'bg-white/25 text-white border border-white/40 shadow-lg'
                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
            }`}
            onClick={() => setActiveTier('Standard')}
          >
            Standard
          </button>
          <button
            className={`seg text-center px-4 py-3 rounded-full text-sm transition-all ${
              activeTier === 'Premium'
                ? 'bg-white/25 text-white border border-white/40 shadow-lg'
                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
            }`}
            onClick={() => setActiveTier('Premium')}
          >
            Premium
          </button>
          <button
            className={`seg text-center px-4 py-3 rounded-full text-sm transition-all ${
              activeTier === 'Advanced'
                ? 'bg-white/25 text-white border border-white/40 shadow-lg'
                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
            }`}
            onClick={() => setActiveTier('Advanced')}
          >
            Advanced
          </button>
        </div>

        {/* Chips row */}
        <div className="chips flex gap-3 items-center my-2">
          <span className="chip chip-arrow w-11 h-9 rounded-[10px] bg-white/10 border border-white/20 flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-white/70" />
          </span>
          <span className="chip chip-leaf w-11 h-9 rounded-[10px] bg-white/10 border border-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 2.5 1 4.5 2 6l8-8 8 8c1-1.5 2-3.5 2-6 0-5.5-4.5-10-10-10z" />
            </svg>
          </span>
        </div>

        {/* Divider */}
        <hr className="divline border-0 h-px bg-white/20 opacity-35 my-2.5" />

        {/* Feature list */}
        <ul className="featlist list-none m-0 p-0 flex flex-col gap-4.5 mt-2">
          <li className="flex items-center justify-between py-2 border-b border-white/18">
            <span className="text-white/90 text-sm">Fue saffier / DHI</span>
            <span className="plus text-white/70 font-bold text-xl">+</span>
          </li>
          <li className="flex items-center justify-between py-2 border-b border-white/18">
            <span className="text-white/90 text-sm">GHI Precision Method ™</span>
            <span className="plus text-white/70 font-bold text-xl">+</span>
          </li>
          <li className="flex items-center justify-between py-2 border-b border-white/18">
            <span className="text-white/90 text-sm">1 Year Personal Aftercare</span>
            <span className="plus text-white/70 font-bold text-xl">+</span>
          </li>
        </ul>

        {/* Price pill */}
        <div className="price-pill absolute right-3.5 bottom-28 px-3.5 py-2 rounded-full bg-white/15 border border-white/25 text-white font-medium text-sm backdrop-blur-sm">
          €8.950
        </div>
      </section>

      {/* Bottom dock */}
      <footer className="bottom-dock fixed left-3 right-3 bottom-4.5 flex gap-3 items-center justify-between z-50">
        <button className="btn-cta flex-1 h-16 rounded-full bg-gradient-to-r from-amber-500/90 to-yellow-600/90 border border-amber-400/30 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
          <span className="label text-white font-medium">Book a consult</span>
          <span className="ico-arrow w-5.5 h-5.5 rounded-full bg-white/20 flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-white" strokeWidth={2.5} />
          </span>
        </button>
        <button className="btn-chat w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/15 transition-all" aria-label="Chat">
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      </footer>
    </main>
  );
};
