'use client';

import { Droplets, User, Play, Pill, ArrowUpRight } from 'lucide-react';

export const RechargeContent = () => {
  return (
    <div className="flex flex-col h-full w-full px-6 pt-6 pb-8 text-white">
      
      {/* Graph Section */}
      <div className="relative w-full aspect-[328/192] rounded-xl overflow-hidden mb-6 border border-white/10 bg-white/5">
        
        {/* Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-r border-white/5 h-full relative">
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-white/40 font-light px-2 py-0.5 rounded-full border border-white/10 bg-black/20">
                Maand {i}
              </span>
            </div>
          ))}
        </div>

        {/* Curves - SVG Overlay */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          viewBox="0 0 328 192" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="rgba(212, 175, 55, 0.4)" />
              <stop offset="100%" stopColor="rgba(212, 175, 55, 0.0)" />
            </linearGradient>
          </defs>

          {/* Curve 1: Blue (Top) */}
          <path
            d="M0,170 C40,90 120,50 328,45"
            fill="none"
            stroke="#a5d8ff"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />
          {/* Dots for Blue Curve */}
          <circle cx="50" cy="115" r="2.5" fill="white" />
          <circle cx="95" cy="88" r="2.5" fill="white" />
          <circle cx="130" cy="74" r="2.5" fill="white" />
          <circle cx="180" cy="62" r="2.5" fill="white" />
          <circle cx="250" cy="55" r="2.5" fill="white" />

          {/* Curve 2: Gold (Middle - Active) */}
          <path
            d="M0,170 C60,130 150,90 328,75"
            fill="url(#goldGradient)"
            stroke="#D4AF37"
            strokeWidth="2"
          />
          {/* Dots for Gold Curve */}
          <circle cx="45" cy="138" r="2.5" fill="#D4AF37" stroke="white" strokeWidth="1" />
          <circle cx="85" cy="118" r="2.5" fill="#D4AF37" stroke="white" strokeWidth="1" />
          <circle cx="115" cy="105" r="2.5" fill="#D4AF37" stroke="white" strokeWidth="1" />
          <circle cx="175" cy="90" r="2.5" fill="#D4AF37" stroke="white" strokeWidth="1" />
          <circle cx="240" cy="80" r="2.5" fill="#D4AF37" stroke="white" strokeWidth="1" />
          <circle cx="280" cy="76" r="6" fill="#1a1a1a" stroke="white" strokeWidth="1" />
          <text x="280" y="80" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">+2</text>

          {/* Curve 3: Bottom Faint */}
          <path
            d="M0,170 C80,160 200,140 328,110"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.2"
          />
           <circle cx="65" cy="158" r="2" fill="white" fillOpacity="0.4" />
           <circle cx="140" cy="148" r="2" fill="white" fillOpacity="0.4" />
           <circle cx="210" cy="135" r="2" fill="white" fillOpacity="0.4" />
        </svg>
      </div>

      {/* Strength Meter */}
      <div className="flex gap-1 h-3 mb-6">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className={`flex-1 rounded-sm transform -skew-x-12 ${
              i < 12 
                ? 'bg-gradient-to-t from-emerald-500 to-teal-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]' 
                : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Info Rows */}
      <div className="space-y-4 mb-auto">
        {/* Row 1 */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <Droplets className="text-white/80" size={18} />
          <span className="text-sm font-light text-white/90">Injection volume</span>
        </div>

        {/* Row 2 */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <User className="text-white/80" size={18} />
          <span className="text-sm font-light text-white/90">Mild to moderate hair thinning</span>
        </div>

        {/* Row 3 */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <div className="w-[18px] flex justify-center">
             <Play className="text-white/60 fill-white/60" size={12} />
          </div>
          <span className="text-sm font-light text-white/70">Standard protocol tempo</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Single Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 flex flex-col justify-end min-h-[140px]">
           <div className="mt-auto">
             <div className="text-sm text-white font-normal mb-1">Single</div>
             <div className="px-3 py-1 bg-white/10 rounded-full inline-block text-sm font-light">€250</div>
           </div>
        </div>

        {/* Treatment Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#3a2e1e] to-transparent border border-[#d4af37]/30 flex flex-col min-h-[140px] relative overflow-hidden">
           {/* Glow effect */}
           <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#d4af37]/20 blur-2xl rounded-full pointer-events-none" />
           
           <div className="flex gap-2 mb-4">
             <Pill className="text-white/80" size={16} />
             <div className="w-4 h-4 rounded-full border border-white/80" />
           </div>
           
           <div className="text-[10px] text-white/60 mb-auto">+ Shampoo & Biotine cure</div>

           <div className="mt-2">
             <div className="text-sm text-white font-normal mb-1">Treatment</div>
             <div className="px-3 py-1 bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-full inline-block text-sm font-light">€1.520</div>
           </div>
        </div>
      </div>



    </div>
  );
};
