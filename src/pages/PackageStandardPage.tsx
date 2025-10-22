import { useState } from 'react';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import chevronRightSvg from '@/assets/chevron-right.svg';
import leafSvg from '@/assets/leaf.svg';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';

export const PackageStandardPage = () => {
  const { language } = useLanguage();
  const [activeCountry, setActiveCountry] = useState<'nl' | 'tr'>('nl');
  const [activeTier, setActiveTier] = useState<'Standard' | 'Premium' | 'Advanced'>('Standard');
  const [isExiting, setIsExiting] = useState(false);
  const { handlePopupClose } = usePopupClose();

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(350);
  };

  return (
    <>
      <div
        className={`reviews-page-fullscreen ${isExiting ? 'reviews-page-exit' : ''}`}
        style={{
          background: 'linear-gradient(180deg, #040E15 0%, #333D46 100%)',
          overflow: 'hidden',
          position: 'fixed',
          inset: 0,
          zIndex: 30
        }}
      >
        <div 
          className="h-full flex items-start justify-center p-4 pt-4"
        >
          <main className="flex flex-col w-full max-w-2xl h-[87vh]">
            <section 
              className="relative rounded-[32px] p-6 pb-8 backdrop-blur-xl bg-gradient-to-b from-[#040E15] to-[#333D46] shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-full flex flex-col" 
              style={{ 
                border: '1px solid transparent',
                backgroundImage: 'linear-gradient(#040E15, #333D46), linear-gradient(180deg, #4B555E 0%, #ACB9C1 15%, #FFFFFF 50%, #ACB9C1 85%, #4B555E 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
            >
              {/* Close button inside section */}
              <PopupCloseButton onClose={handleClose} className="absolute top-4 left-4 z-10" />

        {/* Country toggle */}
        <div 
          className="flex gap-0 justify-center mt-6 mb-4 mx-auto max-w-[280px] border border-white/20" 
          role="tablist" 
          aria-label="Country"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            padding: '4px',
          }}
        >
          <button 
            className={`flex-1 px-4 py-1.5 rounded-full text-xs font-light transition-all ${
              activeCountry === 'nl' 
                ? 'silver-gradient-border bg-white/10 text-white mx-1' 
                : 'bg-transparent text-white/50 hover:text-white/70'
            }`}
            onClick={() => setActiveCountry('nl')}
          >
            Nederland
          </button>
          <button 
            className={`flex-1 px-4 py-1.5 rounded-full text-xs font-light transition-all ${
              activeCountry === 'tr' 
                ? 'silver-gradient-border bg-white/10 text-white mx-1' 
                : 'bg-transparent text-white/50 hover:text-white/70'
            }`}
            onClick={() => setActiveCountry('tr')}
          >
            Turkije
          </button>
        </div>

        {/* Tier pill */}
        <div 
          className="relative mx-auto my-4 max-w-[360px] border border-white/20" 
          aria-label="Tiers"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            padding: '4px',
          }}
        >
          <div className="grid grid-cols-3 gap-1">
            <button
              className={`relative text-center px-3 py-1.5 rounded-full text-xs font-light transition-all ${
                activeTier === 'Standard'
                  ? 'silver-gradient-border bg-white/10 text-white'
                  : 'bg-transparent text-white/50 hover:text-white/70'
              }`}
              onClick={() => setActiveTier('Standard')}
            >
              Standard
            </button>
            <button
              className={`relative text-center px-3 py-1.5 rounded-full text-xs font-light transition-all ${
                activeTier === 'Premium'
                  ? 'silver-gradient-border bg-white/10 text-white'
                  : 'bg-transparent text-white/50 hover:text-white/70'
              }`}
              onClick={() => setActiveTier('Premium')}
            >
              Premium
            </button>
            <button
              className={`relative text-center px-3 py-1.5 rounded-full text-xs font-light transition-all ${
                activeTier === 'Advanced'
                  ? 'silver-gradient-border bg-white/10 text-white'
                  : 'bg-transparent text-white/50 hover:text-white/70'
              }`}
              onClick={() => setActiveTier('Advanced')}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Chips row */}
        <div className="flex gap-2 items-center my-4 px-1">
          <div
            className="silver-grey-gradient-border flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%)',
              padding: '.5rem',
              borderRadius: '.4rem',
            }}
          >
            <img src={chevronRightSvg} alt="" className="w-3.5 h-3.5 opacity-70" />
          </div>
          <div
            className="silver-grey-gradient-border flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%)',
              padding: '.5rem',
              borderRadius: '.4rem',
            }}
          >
            <img src={leafSvg} alt="" className="w-4 h-4 opacity-70" />
          </div>
        </div>

        {/* Feature list */}
        <ul className="list-none m-0 p-0 flex flex-col mt-4 px-1">
          <li className="flex items-center justify-between py-3 border-b border-white/[0.15]">
            <span className="text-white text-sm font-normal">Fue saffier / DHI</span>
            <span className="text-white/60 font-light text-xl leading-none">+</span>
          </li>
          <li className="flex items-center justify-between py-3 border-b border-white/[0.15] gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-white/70 flex-shrink-0" strokeWidth={1.5} />
              <span className="text-white text-sm font-normal">GHI Precision Method ™</span>
            </div>
            <span className="text-white/60 font-light text-xl leading-none">+</span>
          </li>
          <li className="flex items-center justify-between py-3 border-b border-white/[0.15] gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-white/70 flex-shrink-0" strokeWidth={1.5} />
              <span className="text-white text-sm font-normal">1 Year Personal Aftercare</span>
            </div>
            <span className="text-white/60 font-light text-xl leading-none">+</span>
          </li>
        </ul>

        {/* Price pill */}
        <div className="flex justify-end mt-4 px-1">
          <div className="px-4 py-1.5 rounded-full bg-black/40 border border-white/20 text-white font-medium text-sm backdrop-blur-md">
            €8.950
          </div>
        </div>
      </section>
    </main>
  </div>
</div>
<FooterCTAGlass />
</>
);
};
