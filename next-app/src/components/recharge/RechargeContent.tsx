'use client';

import React from 'react';

import Image from 'next/image';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import dropletIcon from '@/assets/droplet.svg';
import personIcon from '@/assets/person.svg';
import treatmentIcon from '@/assets/shampoo-cure.svg';
import { useRouter, useParams } from 'next/navigation';

import { RechargeGraph } from './RechargeGraph';

export const RechargeContent = ({ method = 'recharge' }: { method?: 'recharge' | 'rescue' | 'reborn' }) => {
  const router = useRouter();
  const params = useParams();
  const rawLang = params?.lang;
  const lang = Array.isArray(rawLang) ? rawLang[0] : rawLang || 'en';

  const handleMethodNav = React.useCallback((m: string) => {
    router.push(`/${lang}/v6-hairboost/${m}` as any);
  }, [lang, router]);

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

  return (
    <motion.div 
      id="recharge-content-container" 
      className="flex flex-col h-full w-full px-6 pt-4 pb-6 text-white relative z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      {/* Graph Section - Extracted & Memoized */}
      <motion.div id="recharge-graph-section" variants={itemVariants}>
        <RechargeGraph method={method} onNavigate={handleMethodNav} />
      </motion.div>

      {/* Strength Meter */}
      <motion.div id="recharge-strength-meter" variants={itemVariants} className="relative h-8 w-full mb-3 flex-shrink-0">
        <div className="flex gap-1.5 h-full" style={{ paddingRight: '12px' }}>
          {[...Array(15)].map((_, i) => {
            const isActive = i < (method === 'recharge' ? 10 : 15);
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
                  clipPath: 'polygon(0% 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
                  marginRight: '-5px', // Reduced gap for the first transition
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
      <motion.div id="recharge-info-rows" variants={itemVariants} className="space-y-2 flex-shrink-0 mb-4">
        {/* Row 1 */}
        <div className="flex items-center gap-3 border-b border-white/35 pb-2">
          <div className="w-6 flex justify-center">
            <Image src={dropletIcon} alt="druppel" className="w-[30px] h-[30px] block opacity-100" 
            style={{ maxWidth: 'none', filter: 'brightness(0) invert(1)' }} />
          </div>
          <span 
            className="text-[14px] font-normal"
          >
            Injection volume
          </span>
        </div>

        {/* Row 2 */}
        <div className="flex items-center gap-3 border-b border-white/35 pb-2">
          <div className="w-6 flex justify-center">
            <Image src={personIcon} alt="druppel" className="w-[30px] h-[30px] block opacity-100" 
            style={{ maxWidth: 'none', filter: 'brightness(0) invert(1)' }} />
          </div>
          <span 
            className="text-[14px] font-light"
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
          <div className="w-6 flex justify-center">
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
                    className="text-[14px] font-light"
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span 
              className="text-[14px] font-light"
            >
              {method === 'recharge' ? 'Standard protocol tempo' : 'Accelerated protocol'}
            </span>
          )}
        </div>
      </motion.div>

      {/* Pricing Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 flex-1">
        {/* Single Column */}
        <div id="recharge-pricing-single" className="flex flex-col justify-end pr-4 border-r border-white/35 pb-4">
           <div>
             <div 
               className="text-sm font-normal mb-2"
             >
               Single
             </div>
             <div className="px-3 py-1 bg-white/10 rounded-full inline-block text-sm font-normal text-white">
               €{method === 'recharge' ? '250' : '275'}
             </div>
           </div>
        </div>

        {/* Treatment Column */}
        <div id="recharge-pricing-treatment" className="flex flex-col pl-4 items-start pb-4">
           <div className="flex gap-3 mb-2">
              <Image src={treatmentIcon} alt="Treatment" className="h-[32px] w-auto" 
              style={{ maxWidth: 'none', filter: 'brightness(0) invert(1)' }} />
           </div>
           
           <div className="text-[10px] mb-auto" style={{ color: '#DBDBDB' }}>+ Shampoo & Biotine cure</div>

           <div className="mt-2 w-full flex flex-col items-end">
             <div 
               className="text-sm font-normal mb-2"
             >
               Treatment
             </div>
             <div className="px-3 py-1 bg-white/10 rounded-full inline-block text-sm font-normal text-white">
               €{method === 'rescue' ? '1.680' : '1.520'}
             </div>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
