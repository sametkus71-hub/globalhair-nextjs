import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Shield } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import chevronRightSvg from '@/assets/chevron-right.svg';
import leafSvg from '@/assets/leaf.svg';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';

export const PackageStandardPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeCountry, setActiveCountry] = useState<'nl' | 'tr'>('nl');
  const [activeTier, setActiveTier] = useState<'Standard' | 'Premium' | 'Advanced'>('Standard');

  const handleClose = () => {
    navigate(`/${language}/haartransplantatie`);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between px-4 pt-12 pb-32 bg-gradient-to-b from-[#040E15] to-[#333D46]">
      <section 
        className="relative rounded-[32px] p-5 pb-8 backdrop-blur-xl bg-gradient-to-b from-[#040E15] to-[#333D46] shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
        style={{ 
          minHeight: 'calc(100vh - 180px)',
          border: '1px solid transparent',
          backgroundImage: 'linear-gradient(#040E15, #333D46), linear-gradient(180deg, #4B555E 0%, #ACB9C1 15%, #FFFFFF 50%, #ACB9C1 85%, #4B555E 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box'
        }}
      >
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-5 left-5 bg-transparent border-0 text-white/70 hover:text-white transition-colors p-0"
          aria-label="Close"
        >
          <X className="w-8 h-8" strokeWidth={2} />
        </button>

        {/* Country toggle */}
        <div className="flex gap-0 justify-center mt-12 mb-6" role="tablist" aria-label="Country">
          <button 
            className={`px-6 py-2.5 rounded-l-full text-sm font-medium transition-all border-y border-l ${
              activeCountry === 'nl' 
                ? 'bg-white/[0.08] text-white border-white/30' 
                : 'bg-transparent text-white/50 border-white/20 hover:bg-white/[0.04]'
            }`}
            onClick={() => setActiveCountry('nl')}
          >
            Nederland
          </button>
          <button 
            className={`px-6 py-2.5 rounded-r-full text-sm font-medium transition-all border-y border-r ${
              activeCountry === 'tr' 
                ? 'bg-white/[0.08] text-white border-white/30' 
                : 'bg-transparent text-white/50 border-white/20 hover:bg-white/[0.04]'
            }`}
            onClick={() => setActiveCountry('tr')}
          >
            Turkije
          </button>
        </div>

        {/* Tier pill - connected segments */}
        <div className="relative mx-4 my-6 rounded-full border border-white/20 bg-white/[0.03] p-1.5 backdrop-blur-sm" aria-label="Tiers">
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`relative text-center px-5 py-3.5 rounded-full text-[15px] font-medium transition-all ${
                activeTier === 'Standard'
                  ? 'bg-white/[0.15] text-white border-2 border-white/40 shadow-lg z-10'
                  : 'bg-transparent text-white/50 border-2 border-transparent hover:text-white/70'
              }`}
              onClick={() => setActiveTier('Standard')}
            >
              Standard
            </button>
            <button
              className={`relative text-center px-5 py-3.5 rounded-full text-[15px] font-medium transition-all ${
                activeTier === 'Premium'
                  ? 'bg-white/[0.15] text-white border-2 border-white/40 shadow-lg z-10'
                  : 'bg-transparent text-white/50 border-2 border-transparent hover:text-white/70'
              }`}
              onClick={() => setActiveTier('Premium')}
            >
              Premium
            </button>
            <button
              className={`relative text-center px-5 py-3.5 rounded-full text-[15px] font-medium transition-all ${
                activeTier === 'Advanced'
                  ? 'bg-white/[0.15] text-white border-2 border-white/40 shadow-lg z-10'
                  : 'bg-transparent text-white/50 border-2 border-transparent hover:text-white/70'
              }`}
              onClick={() => setActiveTier('Advanced')}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Chips row */}
        <div className="flex gap-3 items-center my-6 px-1">
          <span className="w-[52px] h-[52px] rounded-[14px] bg-white/[0.06] border border-white/20 flex items-center justify-center">
            <img src={chevronRightSvg} alt="" className="w-4 h-4 opacity-70" />
          </span>
          <span className="w-[52px] h-[52px] rounded-[14px] bg-white/[0.06] border border-white/20 flex items-center justify-center">
            <img src={leafSvg} alt="" className="w-5 h-5 opacity-70" />
          </span>
        </div>

        {/* Feature list */}
        <ul className="list-none m-0 p-0 flex flex-col mt-6 px-1">
          <li className="flex items-center justify-between py-5 border-b border-white/[0.15]">
            <span className="text-white text-[17px] font-normal">Fue saffier / DHI</span>
            <span className="text-white/60 font-light text-2xl leading-none">+</span>
          </li>
          <li className="flex items-center justify-between py-5 border-b border-white/[0.15] gap-3">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-white/70 flex-shrink-0" strokeWidth={1.5} />
              <span className="text-white text-[17px] font-normal">GHI Precision Method ™</span>
            </div>
            <span className="text-white/60 font-light text-2xl leading-none">+</span>
          </li>
          <li className="flex items-center justify-between py-5 border-b border-white/[0.15] gap-3">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-white/70 flex-shrink-0" strokeWidth={1.5} />
              <span className="text-white text-[17px] font-normal">1 Year Personal Aftercare</span>
            </div>
            <span className="text-white/60 font-light text-2xl leading-none">+</span>
          </li>
        </ul>

        {/* Price pill */}
        <div className="absolute right-6 bottom-32 px-5 py-2.5 rounded-full bg-black/40 border border-white/20 text-white font-medium text-base backdrop-blur-md">
          €8.950
        </div>
      </section>

      {/* Footer CTA */}
      <FooterCTAGlass />
    </main>
  );
};
