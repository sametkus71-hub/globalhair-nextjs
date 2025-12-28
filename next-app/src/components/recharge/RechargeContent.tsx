'use client';

import React from 'react';

import { Droplet, User, Pill, ArrowUpRight } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';

export const RechargeContent = ({ method = 'recharge' }: { method?: 'recharge' | 'rescue' | 'reborn' }) => {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang || 'en';
  const [hoveredCurve, setHoveredCurve] = React.useState<string | null>(null);

  const handleMethodNav = (m: string) => {
    router.push(`/${lang}/v6-hairboost/methods/${m}` as any);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const graphPathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut", delay: 0.3 }
    }
  };

  const dotVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
  };

  return (
    <motion.div 
      id="recharge-content-container" 
      className="flex flex-col h-full w-full px-6 pt-4 pb-6 text-white relative z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      {/* Graph Section */}
      <motion.div id="recharge-graph-section" variants={itemVariants} className="relative w-full aspect-[328/250] flex-shrink-0 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-black/60 to-black/40 shadow-inner flex items-center justify-center">
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
        <motion.div 
          id="recharge-graph-grid" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 grid grid-cols-4 pointer-events-none z-0"
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-r border-white/35 h-full relative flex items-end justify-center pb-4">
              <span className="text-[8px] text-white/50 font-light px-2.5 py-0.5 rounded-full border border-white/35 bg-white/5 backdrop-blur-[2px]">
                Maand {i}
              </span>
            </div>
          ))}
        </motion.div>

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
                 <stop offset="0%" stopColor="#FBDB6A" stopOpacity="0.6" />
                 <stop offset="100%" stopColor="#7E601C" stopOpacity="0" />
               </linearGradient>
               <linearGradient id="orangeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#FF9100" stopOpacity="0.6" />
                 <stop offset="100%" stopColor="#7E3B1C" stopOpacity="0" />
               </linearGradient>
               <linearGradient id="blueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#9DC4EA" stopOpacity="0.6" />
                 <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
               </linearGradient>
              <linearGradient id="blueLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9DC4EA" />
                <stop offset="46.73%" stopColor="#FFFFFF" />
                <stop offset="94.05%" stopColor="#9DC4EA" />
              </linearGradient>
              <filter id="blueGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="goldGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="orangeGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Legend: Treatment */}
            <g transform="translate(14, 16)">
              <circle cx="0" cy="0" r="4.5" fill="white" fillOpacity="0.3" filter="url(#goldGlow)" />
              <circle cx="0" cy="0" r="2.5" fill="white" />
              <text 
                x="12" 
                y="3.5" 
                fill="white" 
                fillOpacity="0.7" 
                style={{ 
                  fontSize: '9px', 
                  fontWeight: 500, 
                  letterSpacing: '0.05em', 
                  textTransform: 'uppercase',
                  fontFamily: 'inherit'
                }}
              >
                Treatment
              </text>
            </g>

            {/* Vertical centering group: (250 - 192) / 2 = 29px offset */}
            <g transform="translate(0, 29)">
              {/* Background Area Fills - Morphing AND Cross-fading for "filling up" effect */}
              {['recharge', 'rescue', 'reborn'].map((m) => (
                <motion.path
                  key={m}
                  initial={{ opacity: 0, d: "M0,192 C100,160 200,130 328,110 L 328,250 L 0,250 Z" }}
                  animate={{ 
                    opacity: method === m ? 1 : 0,
                    d: method === 'reborn'
                      ? "M0,192 C40,90 140,50 328,35 L 328,250 L 0,250 Z"
                      : method === 'rescue' 
                      ? "M0,192 C60,130 160,85 328,85 L 328,250 L 0,250 Z" 
                      : "M0,192 C100,160 200,130 328,110 L 328,250 L 0,250 Z"
                  }}
                  transition={{ 
                    opacity: { duration: 0.8, ease: "easeInOut" },
                    d: { duration: 0.8, ease: "easeInOut" }
                  }}
                  fill={
                    m === 'reborn'
                      ? "url(#blueAreaGradient)"
                      : m === 'rescue'
                      ? "url(#orangeAreaGradient)"
                      : "url(#goldAreaGradient)"
                  }
                  style={{ pointerEvents: 'none' }}
                />
              ))}

              {/* Curve 3: Bottom Faint (Baseline) */}
              <motion.path
                d="M0,192 C100,160 200,130 328,110"
                fill="none"
                stroke="#FCD34D"
                strokeWidth="2"
                strokeOpacity={method === 'recharge' || hoveredCurve === 'recharge' ? 0.4 : 0.3}
                animate={{ strokeOpacity: method === 'recharge' || hoveredCurve === 'recharge' ? 0.4 : 0.3 }}
                transition={{ duration: 0.8 }}
                variants={graphPathVariants}
                onClick={() => handleMethodNav('recharge')}
                onMouseEnter={() => setHoveredCurve('recharge')}
                onMouseLeave={() => setHoveredCurve(null)}
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              />
              {/* Dots for Baseline - High Fidelity */}
              <motion.g 
                onClick={() => handleMethodNav('recharge')}
                onMouseEnter={() => setHoveredCurve('recharge')}
                onMouseLeave={() => setHoveredCurve(null)}
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                transition={{ staggerChildren: 0.1, delayChildren: 1.2 }}
                animate={{ opacity: method === 'recharge' || hoveredCurve === 'recharge' ? 1 : 0.45 }}
              >
                {[
                  { cx: 41, cy: 178 },
                  { cx: 123, cy: 154 },
                  { cx: 205, cy: 134 },
                  { cx: 287, cy: 117 }
                ].map((dot, i) => (
                  <motion.g key={i} variants={dotVariants}>
                    <circle cx={dot.cx} cy={dot.cy} r="6" fill="#FCD34D" fillOpacity="0.2" filter="url(#goldGlow)" />
                    <circle cx={dot.cx} cy={dot.cy} r="2.5" fill="#FFFFFF" />
                  </motion.g>
                ))}
              </motion.g>

              {/* Curve 1: Blue (Top - Potential) */}
              <motion.path
                 d="M0,192 C40,90 140,50 328,35"
                 fill="none"
                 stroke="url(#blueLineGradient)"
                 strokeWidth="2"
                 strokeLinecap="round"
                 filter="url(#blueGlow)"
                 strokeOpacity={method === 'reborn' || hoveredCurve === 'reborn' ? 1 : 0.4}
                 animate={{ strokeOpacity: method === 'reborn' || hoveredCurve === 'reborn' ? 1 : 0.4 }}
                 transition={{ duration: 0.8 }}
                 variants={graphPathVariants}
                 onClick={() => handleMethodNav('reborn')}
                 onMouseEnter={() => setHoveredCurve('reborn')}
                 onMouseLeave={() => setHoveredCurve(null)}
                 style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              />
              <motion.g 
                onClick={() => handleMethodNav('reborn')}
                onMouseEnter={() => setHoveredCurve('reborn')}
                onMouseLeave={() => setHoveredCurve(null)}
                transition={{ staggerChildren: 0.1, delayChildren: 1.2 }}
                animate={{ opacity: method === 'reborn' || hoveredCurve === 'reborn' ? 1 : 0.4 }}
              >
                {[
                  { cx: 45, cy: 125 },
                  { cx: 90, cy: 90 },
                  { cx: 130, cy: 72 },
                  { cx: 170, cy: 58 },
                  { cx: 258, cy: 42 }
                ].map((dot, i) => (
                  <motion.g key={i} variants={dotVariants}>
                    <circle cx={dot.cx} cy={dot.cy} r="8" fill="#93C5FD" fillOpacity="0.25" filter="url(#blueGlow)" />
                    <circle cx={dot.cx} cy={dot.cy} r="3.5" fill="#FFFFFF" />
                  </motion.g>
                ))}
              </motion.g>

              {/* Curve 2: Gold (Middle - Active Path) */}
              <motion.path
                d="M0,192 C60,130 160,85 328,85"
                fill="none"
                stroke="#FF9100"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#orangeGlow)"
                strokeOpacity={method === 'rescue' || hoveredCurve === 'rescue' ? 1 : 0.4}
                animate={{ strokeOpacity: method === 'rescue' || hoveredCurve === 'rescue' ? 1 : 0.4 }}
                transition={{ duration: 0.8 }}
                variants={graphPathVariants}
                onClick={() => handleMethodNav('rescue')}
                onMouseEnter={() => setHoveredCurve('rescue')}
                onMouseLeave={() => setHoveredCurve(null)}
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              />
              <motion.g 
                onClick={() => handleMethodNav('rescue')}
                onMouseEnter={() => setHoveredCurve('rescue')}
                onMouseLeave={() => setHoveredCurve(null)}
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                transition={{ staggerChildren: 0.1, delayChildren: 1.2 }}
                animate={{ opacity: method === 'rescue' || hoveredCurve === 'rescue' ? 1 : 0.4 }}
              >
                {[
                  { cx: 48, cy: 153 },
                  { cx: 100, cy: 124 },
                  { cx: 150, cy: 106 },
                  { cx: 200, cy: 95 },
                  { cx: 255, cy: 87 }
                ].map((dot, i) => (
                  <motion.g key={i} variants={dotVariants}>
                    <circle cx={dot.cx} cy={dot.cy} r="8" fill="#FF9100" fillOpacity="0.25" filter="url(#orangeGlow)" />
                    <circle cx={dot.cx} cy={dot.cy} r="3.5" fill="#FFFFFF" />
                  </motion.g>
                ))}
              </motion.g>
            </g>
          </svg>

          <AnimatePresence>
            {hoveredCurve && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl pointer-events-none"
              >
                <span className="text-[10px] font-medium tracking-wider uppercase text-white/90">
                  {hoveredCurve}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Strength Meter */}
      <motion.div id="recharge-strength-meter" variants={itemVariants} className="relative h-6 w-full mb-3 flex-shrink-0">
        <div className="flex gap-1.5 h-full" style={{ paddingRight: '12px' }}>
          {[...Array(20)].map((_, i) => {
            const isActive = i < (method === 'recharge' ? 12 : 20);
            const isFirst = i === 0;
            return (
              <motion.div 
                key={i}
                initial={false}
                animate={{
                  background: isActive 
                    ? 'linear-gradient(180deg, #a7f3d0 0%, #34d399 50%, #10b981 100%)' 
                    : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                  boxShadow: isActive 
                    ? (isFirst ? 'inset 0 1px 2px rgba(255,255,255,0.3)' : 'inset 0 1px 2px rgba(255,255,255,0.3), 0 0 12px rgba(52,211,153,0.4)')
                    : 'inset 0 1px 2px rgba(255,255,255,0.05)',
                }}
                transition={{
                  duration: 0.23,
                  delay: isActive ? i * 0.03 : (19 - i) * 0.03,
                  ease: "easeOut"
                }}
                className={`h-full flex-shrink-0 ${isFirst ? 'w-5' : 'flex-1 min-w-0'}`}
                style={isFirst ? {
                  clipPath: 'polygon(0% 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                  marginRight: '-4px', // Reduced gap for the first transition
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px 0 0 2px'
                } : {
                  transform: 'skewX(-22deg)',
                  borderRadius: '1.5px',
                  border: '0.5px solid rgba(255,255,255,0.1)'
                }}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Info Rows */}
      <motion.div id="recharge-info-rows" variants={itemVariants} className="space-y-2 flex-shrink-0">
        {/* Row 1 */}
        <div className="flex items-center gap-3 border-b border-white/35 pb-2">
          <div className="w-6 flex justify-center">
            <Droplet className="text-white" size={18} />
          </div>
          <span 
            className="text-[14px] font-normal"
            style={{
              background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0px 3.39px 18.55px #FFFFFF40'
            }}
          >
            Injection volume
          </span>
        </div>

        {/* Row 2 */}
        <div className="flex items-center gap-3 border-b border-white/35 pb-2">
          <div className="w-6 flex justify-center">
            <User className="text-white" size={18} />
          </div>
          <span 
            className="text-[14px] font-normal"
            style={{
              background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0px 3.39px 18.55px #FFFFFF40'
            }}
          >
            {method === 'recharge' 
              ? 'Mild to moderate hair thinning' 
              : method === 'rescue'
              ? 'Advanced hair loss needing faster action'
              : '30% more hair regeneration for maximal results'}
          </span>
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
            gap: '1px',
            width: method === 'recharge' ? '20px' : method === 'rescue' ? '24px' : '28px',
            height: method === 'recharge' ? '20px' : '24px'
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
            <img alt="" src="/_next/static/media/chevron-right.57497cd4.svg" style={{ width: method === 'recharge' ? '10px' : '9px', height: method === 'recharge' ? '10px' : '9px', position: 'relative', zIndex: 1 }} />
            {method !== 'recharge' && (
              <img 
                alt="" 
                src="/_next/static/media/chevron-right.57497cd4.svg" 
                style={{ width: '9px', height: '9px', position: 'relative', zIndex: 1, marginLeft: '-4px' }} 
              />
            )}
            {method === 'reborn' && (
              <img 
                alt="" 
                src="/_next/static/media/chevron-right.57497cd4.svg" 
                style={{ width: '9px', height: '9px', position: 'relative', zIndex: 1, marginLeft: '-4px' }} 
              />
            )}
          </div>
          
          {method === 'reborn' ? (
            <div className="flex flex-col gap-0.5">
              {[
                { text: 'Accelerated protocol' },
                { text: 'GHI Stemcell Repair ®' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/70" />
                  <span 
                    className="text-[14px] font-normal"
                    style={{
                      background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span 
              className="text-[14px] font-normal"
              style={{
                background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0px 3.39px 18.55px #FFFFFF40'
              }}
            >
              {method === 'recharge' ? 'Standard protocol tempo' : 'Accelerated protocol'}
            </span>
          )}
        </div>
      </motion.div>

      {/* Pricing Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 flex-1 pt-4">
        {/* Single Column */}
        <div id="recharge-pricing-single" className="flex flex-col justify-end pr-4 border-r border-white/35 pb-4">
           <div>
             <div 
               className="text-sm font-normal mb-2"
               style={{
                 background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
                 backgroundClip: 'text',
                 textShadow: '0px 3.39px 18.55px #FFFFFF40'
               }}
             >
               Single
             </div>
             <div className="px-3 py-1 bg-white/10 rounded-full inline-block text-sm font-medium text-white">
               €{method === 'recharge' ? '250' : '275'}
             </div>
           </div>
        </div>

        {/* Treatment Column */}
        <div id="recharge-pricing-treatment" className="flex flex-col pl-4 items-start pb-4">
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
             <div 
               className="text-sm font-normal mb-2"
               style={{
                 background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
                 backgroundClip: 'text',
                 textShadow: '0px 3.39px 18.55px #FFFFFF40'
               }}
             >
               Treatment
             </div>
             <div className="px-3 py-1 bg-white/10 rounded-full inline-block text-sm font-medium text-white">
               €{method === 'rescue' ? '1.680' : '1.520'}
             </div>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
