'use client';

import React, { memo } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';

// Defined variants outside to prevent recreation
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

const gridItems = [1, 2, 3, 4];
const methods = ['recharge', 'rescue', 'reborn'];

const rebornDots = [
  { cx: 38, cy: 115 },
  { cx: 81, cy: 78 },
  { cx: 130, cy: 54 },
  { cx: 190, cy: 38 },
  { cx: 263, cy: 28 }
];

const rescueDots = [
  { cx: 30, cy: 152 },
  { cx: 55, cy: 130 },
  { cx: 90, cy: 110 },
  { cx: 130, cy: 94 },
  { cx: 175, cy: 85 }
];

const rechargeDots = [
  { cx: 48, cy: 176 },
  { cx: 90, cy: 162 },
  { cx: 145, cy: 144 },
  { cx: 200, cy: 126 },
  { cx: 260, cy: 107 }
];

interface RechargeGraphProps {
  method: 'recharge' | 'rescue' | 'reborn';
  onNavigate: (m: string) => void;
}

export const RechargeGraph = memo(({ method, onNavigate }: RechargeGraphProps) => {
  const [hoveredCurve, setHoveredCurve] = React.useState<string | null>(null);

  // Helper to determine if a curve is active or hovered
  const isHighlighted = (target: string) => method === target || hoveredCurve === target;

  return (
    <div className="relative w-full aspect-[328/250] flex-shrink-0 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-black/60 to-black/40 shadow-inner flex items-center justify-center">
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
        
        {/* Grid Lines */}
        <motion.div 
          id="recharge-graph-grid" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 grid grid-cols-4 pointer-events-none z-0"
        >
          {gridItems.map((i) => (
            <div key={i} className="border-r border-white/35 h-full relative flex items-end justify-center pb-4">
              <span className="text-[8px] text-white/50 font-light px-2.5 py-0.5 rounded-full border border-white/35 bg-white/5 backdrop-blur-[2px]">
                Maand {i}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Internal Graph Wrapper */}
        <div className="absolute inset-0 z-10">
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

            {/* Vertical centering group */}
            <g transform="translate(0, 29)">
              {/* Background Area Fills */}
              {methods.map((m) => (
                <motion.path
                  key={m}
                  initial={{ opacity: 0, d: "M0,192 C100,160 220,120 328,85 C328,85 328,85 328,85 L 328,250 L 0,250 Z" }}
                  animate={{ 
                    opacity: method === m ? 1 : 0,
                    d: method === 'reborn'
                      ? "M0,192 C30,80 120,30 328,25 C328,25 328,25 328,25 L 328,250 L 0,250 Z"
                      : method === 'rescue' 
                      ? "M0,192 C40,120 130,85 190,85 C260,85 328,85 328,85 L 328,250 L 0,250 Z" 
                      : "M0,192 C109,156 219,121 328,85 C328,85 328,85 328,85 L 328,250 L 0,250 Z"
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

              {/* Curve 1: Blue (Top - Potential) */}
              <motion.path
                 d="M0,192 C30,80 120,30 328,25"
                 fill="none"
                 stroke="url(#blueLineGradient)"
                 strokeWidth="2"
                 strokeLinecap="round"
                 filter="url(#blueGlow)"
                 strokeOpacity={isHighlighted('reborn') ? 1 : 0.4}
                 animate={{ strokeOpacity: isHighlighted('reborn') ? 1 : 0.4 }}
                 transition={{ duration: 0.8 }}
                 variants={graphPathVariants}
                 onClick={() => onNavigate('reborn')}
                 onMouseEnter={() => setHoveredCurve('reborn')}
                 onMouseLeave={() => setHoveredCurve(null)}
                 style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              />
              <motion.g 
                onClick={() => onNavigate('reborn')}
                onMouseEnter={() => setHoveredCurve('reborn')}
                onMouseLeave={() => setHoveredCurve(null)}
                transition={{ staggerChildren: 0.1, delayChildren: 1.2 }}
                animate={{ opacity: isHighlighted('reborn') ? 1 : 0.4 }}
              >
                {rebornDots.map((dot, i) => (
                  <motion.g key={i} variants={dotVariants}>
                    <circle cx={dot.cx} cy={dot.cy} r="8" fill="#93C5FD" fillOpacity="0.25" filter="url(#blueGlow)" />
                    <circle cx={dot.cx} cy={dot.cy} r="3.5" fill="#FFFFFF" />
                  </motion.g>
                ))}
              </motion.g>

              {/* Curve 2: Orange (Middle - Rescue) */}
              <motion.path
                d="M0,192 C40,120 130,85 190,85 L 328,85"
                fill="none"
                stroke="#FF9100"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#orangeGlow)"
                strokeOpacity={isHighlighted('rescue') ? 1 : 0.4}
                animate={{ strokeOpacity: isHighlighted('rescue') ? 1 : 0.4 }}
                transition={{ duration: 0.8 }}
                variants={graphPathVariants}
                onClick={() => onNavigate('rescue')}
                onMouseEnter={() => setHoveredCurve('rescue')}
                onMouseLeave={() => setHoveredCurve(null)}
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              />
              <motion.g 
                onClick={() => onNavigate('rescue')}
                onMouseEnter={() => setHoveredCurve('rescue')}
                onMouseLeave={() => setHoveredCurve(null)}
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                transition={{ staggerChildren: 0.1, delayChildren: 1.2 }}
                animate={{ opacity: isHighlighted('rescue') ? 1 : 0.4 }}
              >
                {rescueDots.map((dot, i) => (
                  <motion.g key={i} variants={dotVariants}>
                    <circle cx={dot.cx} cy={dot.cy} r="8" fill="#FF9100" fillOpacity="0.25" filter="url(#orangeGlow)" />
                    <circle cx={dot.cx} cy={dot.cy} r="3.5" fill="#FFFFFF" />
                  </motion.g>
                ))}
              </motion.g>

              {/* Curve 3: Gold (Bottom - Recharge) */}
              <motion.path
                d="M0,192 L328,85"
                fill="none"
                stroke="#FCD34D"
                strokeWidth="2"
                strokeOpacity={isHighlighted('recharge') ? 0.4 : 0.3}
                animate={{ strokeOpacity: isHighlighted('recharge') ? 0.4 : 0.3 }}
                transition={{ duration: 0.8 }}
                variants={graphPathVariants}
                onClick={() => onNavigate('recharge')}
                onMouseEnter={() => setHoveredCurve('recharge')}
                onMouseLeave={() => setHoveredCurve(null)}
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              />
              <motion.g 
                onClick={() => onNavigate('recharge')}
                onMouseEnter={() => setHoveredCurve('recharge')}
                onMouseLeave={() => setHoveredCurve(null)}
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                transition={{ staggerChildren: 0.1, delayChildren: 1.2 }}
                animate={{ opacity: isHighlighted('recharge') ? 1 : 0.45 }}
              >
                {rechargeDots.map((dot, i) => (
                  <motion.g key={i} variants={dotVariants}>
                    <circle cx={dot.cx} cy={dot.cy} r="6" fill="#FCD34D" fillOpacity="0.2" filter="url(#goldGlow)" />
                    <circle cx={dot.cx} cy={dot.cy} r="2.5" fill="#FFFFFF" />
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
    </div>
  );
});

RechargeGraph.displayName = 'RechargeGraph';
