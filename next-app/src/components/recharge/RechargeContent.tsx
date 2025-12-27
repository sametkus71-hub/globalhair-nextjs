'use client';

import { Droplet, User, Pill, ArrowUpRight } from 'lucide-react';

export const RechargeContent = () => {
  return (
    <div id="recharge-content-container" className="flex flex-col h-full w-full px-6 pt-6 pb-8 text-white">
      
      {/* Graph Section */}
      <div id="recharge-graph-section" className="relative w-full aspect-[328/250] rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-black/60 to-black/40 shadow-inner flex items-center justify-center">
        {/* Silver Gradient Border Ring */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none z-20"
          style={{
             background: 'linear-gradient(to bottom, #a1a1aa, #f4f4f5, #a1a1aa)',
             padding: '1px',
             mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
             WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
             maskComposite: 'exclude',
             WebkitMaskComposite: 'xor'
          }}
        />
        
        {/* Grid Lines - Spanning full box height */}
        <div id="recharge-graph-grid" className="absolute inset-0 grid grid-cols-4 pointer-events-none z-0">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-r border-white/35 h-full relative flex items-end justify-center pb-4">
              <span className="text-[8px] text-white/50 font-light px-2.5 py-0.5 rounded-full border border-white/35 bg-white/5 backdrop-blur-[2px]">
                Maand {i}
              </span>
            </div>
          ))}
        </div>

        {/* Internal Graph Wrapper - Now full height to allow fill to reach the bottom */}
        <div className="absolute inset-0 z-10">
          {/* Curves - SVG Overlay */}
          <svg 
            id="recharge-graph-curves"
            className="w-full h-full pointer-events-none" 
            viewBox="0 0 328 250" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="goldAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="blueLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9DC4EA" />
                <stop offset="46.73%" stopColor="#FFFFFF" />
                <stop offset="94.05%" stopColor="#9DC4EA" />
              </linearGradient>
              <filter id="blueGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                 <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Vertical centering group: (250 - 192) / 2 = 29px offset */}
            <g transform="translate(0, 29)">
              {/* Curve 3: Bottom Faint (Baseline) */}
              <path
                d="M0,192 C100,160 200,130 328,110 L 328,221 L 0,221 Z"
                fill="url(#goldAreaGradient)"
                stroke="none"
              />
              <path
                d="M0,192 C100,160 200,130 328,110"
                fill="none"
                stroke="white"
                strokeWidth="1"
                strokeOpacity="0.15"
              />
              {/* Dots for Baseline */}
               <circle cx="41" cy="178" r="3" fill="#ffffff" fillOpacity="0.3" />
               <circle cx="123" cy="152" r="3" fill="#ffffff" fillOpacity="0.3" />
               <circle cx="205" cy="132" r="3" fill="#ffffff" fillOpacity="0.3" />
               <circle cx="287" cy="118" r="3" fill="#ffffff" fillOpacity="0.3" />

              {/* Curve 1: Blue (Top - Potential) */}
              <path
                 d="M0,192 C40,90 140,50 328,35"
                 fill="none"
                 stroke="url(#blueLineGradient)"
                 strokeWidth="2"
                 strokeLinecap="round"
                 filter="url(#blueGlow)"
              />
              <g>
                 <circle cx="45" cy="125" r="4" fill="#1e293b" stroke="#93C5FD" strokeWidth="2" />
                 <circle cx="90" cy="90" r="4" fill="#1e293b" stroke="#93C5FD" strokeWidth="2" />
                 <circle cx="130" cy="72" r="4" fill="#1e293b" stroke="#93C5FD" strokeWidth="2" />
                 <circle cx="170" cy="58" r="4" fill="#1e293b" stroke="#93C5FD" strokeWidth="2" />
                 <circle cx="258" cy="42" r="4" fill="#1e293b" stroke="#93C5FD" strokeWidth="2" />
              </g>

              {/* Curve 2: Gold (Middle - Active Path) */}
              <path
                d="M0,192 C60,130 160,85 328,85"
                fill="none"
                stroke="#FCD34D"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#goldGlow)"
              />
              <g>
                <circle cx="48" cy="153" r="4" fill="#3A2E1E" stroke="#FCD34D" strokeWidth="2" />
                <circle cx="100" cy="124" r="4" fill="#3A2E1E" stroke="#FCD34D" strokeWidth="2" />
                <circle cx="150" cy="106" r="4" fill="#3A2E1E" stroke="#FCD34D" strokeWidth="2" />
                <circle cx="200" cy="95" r="4" fill="#3A2E1E" stroke="#FCD34D" strokeWidth="2" />
                <circle cx="255" cy="87" r="4" fill="#3A2E1E" stroke="#FCD34D" strokeWidth="2" />
                <g transform="translate(300, 85)">
                   <defs>
                     <linearGradient id="badgeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                     </linearGradient>
                   </defs>
                   <circle r="14" fill="url(#badgeGrad)" stroke="#FCD34D" strokeWidth="1" strokeOpacity="0.5" />
                   <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>+2</text>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Strength Meter */}
      <div id="recharge-strength-meter" className="relative h-6 w-full mb-6">
        <div className="flex gap-1.5 h-full" style={{ paddingRight: '12px' }}>
          {[...Array(20)].map((_, i) => {
            const isActive = i < 12;
            const isFirst = i === 0;
            return (
              <div 
                key={i}
                className={`h-full flex-shrink-0 ${isFirst ? 'w-5' : 'flex-1 min-w-0'}`}
                style={isFirst ? {
                  clipPath: 'polygon(0% 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                  marginRight: '-4px', // Reduced gap for the first transition
                  background: isActive 
                    ? 'linear-gradient(180deg, #a7f3d0 0%, #34d399 50%, #10b981 100%)' 
                    : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                  boxShadow: isActive 
                    ? 'inset 0 1px 2px rgba(255,255,255,0.3)' 
                    : 'inset 0 1px 2px rgba(255,255,255,0.05)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px 0 0 2px'
                } : {
                  transform: 'skewX(-22deg)',
                  borderRadius: '1.5px',
                  background: isActive 
                    ? 'linear-gradient(180deg, #a7f3d0 0%, #34d399 50%, #10b981 100%)' 
                    : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                  boxShadow: isActive 
                    ? 'inset 0 1px 2px rgba(255,255,255,0.3), 0 0 12px rgba(52,211,153,0.4)' 
                    : 'inset 0 1px 2px rgba(255,255,255,0.05)',
                  border: '0.5px solid rgba(255,255,255,0.1)'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Info Rows */}
      <div id="recharge-info-rows" className="space-y-3 mb-4">
        {/* Row 1 */}
        <div className="flex items-center gap-3 border-b border-white/35 pb-2">
          <Droplet className="text-white/60" size={18} />
          <span className="text-[13px] font-light text-white/80">Injection volume</span>
        </div>

        {/* Row 2 */}
        <div className="flex items-center gap-3 border-b border-white/35 pb-2">
          <User className="text-white/60" size={18} />
          <span className="text-[13px] font-light text-white/80">Mild to moderate hair thinning</span>
        </div>

        {/* Row 3 */}
        <div className="flex items-center gap-3 border-b border-white/35 pb-2">
          <div className="indicator-box relative" style={{ 
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 80%)', 
            padding: '2px', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px'
          }}>
            <div 
              className="absolute inset-0 rounded-[4px] pointer-events-none"
              style={{
                 background: 'linear-gradient(to bottom, #a1a1aa, #f4f4f5, #a1a1aa)',
                 padding: '1px',
                 mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                 WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                 maskComposite: 'exclude',
                 WebkitMaskComposite: 'xor'
              }}
            />
            <img alt="" src="/_next/static/media/chevron-right.57497cd4.svg" style={{ width: '10px', height: '10px', position: 'relative', zIndex: 1 }} />
          </div>
          <span className="text-[13px] font-light text-white/80">Standard protocol tempo</span>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="grid grid-cols-2 pt-4">
        {/* Single Column */}
        <div id="recharge-pricing-single" className="flex flex-col justify-end pr-4 border-r border-white/35 min-h-[100px]">
           <div>
             <div className="text-sm text-white/90 font-normal mb-2">Single</div>
             <div className="px-3 py-1 bg-white/10 rounded-full inline-block text-sm font-light text-white/90">€250</div>
           </div>
        </div>

        {/* Treatment Column */}
        <div id="recharge-pricing-treatment" className="flex flex-col pl-4 min-h-[100px] items-start">
           <div className="flex gap-3 mb-2">
             <svg 
               width="28" 
               height="28" 
               viewBox="0 0 24 24" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="1.8" 
               strokeLinecap="round" 
               strokeLinejoin="round" 
               className="text-white/80"
             >
               <path d="M7 11v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8" />
               <path d="M10 11V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
               <path d="M12 5V3" />
               <path d="M10 3h4" />
               <line x1="7" y1="11" x2="17" y2="11" />
             </svg>
             <Pill className="text-white/80" size={28} strokeWidth={1.8} />
           </div>
           
           <div className="text-[10px] mb-auto" style={{ color: '#DBDBDB' }}>+ Shampoo & Biotine cure</div>

           <div className="mt-2 w-full flex flex-col items-end">
             <div className="text-sm text-white/90 font-normal mb-2">Treatment</div>
             <div className="px-3 py-1 bg-white/10 rounded-full inline-block text-sm font-light text-white/90">€1.520</div>
           </div>
        </div>
      </div>



    </div>
  );
};
