'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface GlassTabsProps {
  activeTab: string;
}

const tabs = ['Treatments', 'Reviews', 'How?', 'Mission', 'Contact'];

export const GlassTabs = ({ activeTab }: GlassTabsProps) => {
  const router = useRouter();
  const { language } = useLanguage();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  // Optimistic UI state
  const [optimisticTab, setOptimisticTab] = useState(activeTab);

  // Sync prop with local state (handle back/forward navigation)
  useEffect(() => {
    setOptimisticTab(activeTab);
  }, [activeTab]);

  const getTabPath = (tab: string) => {
    const basePath = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
    const tabPaths: Record<string, string> = {
      'Treatments': basePath,
      'Reviews': `${basePath}/reviews`,
      'How?': `${basePath}/how`,
      'Mission': `${basePath}/mission`,
      'Contact': `${basePath}/contact`,
    };
    return tabPaths[tab] || basePath;
  };

  const handleTabClick = (tab: string) => {
    setOptimisticTab(tab); // Instant visual update
    router.push(getTabPath(tab) as any);
  };

  // Prefetch tab component on hover for instant navigation
  const handleTabHover = useCallback((tab: string) => {
    const componentMap: Record<string, () => Promise<any>> = {
      'Treatments': () => import('@/components/TreatmentsPage'),
      'Reviews': () => import('@/components/HaartransplantatieReviewsPage'),
      'How?': () => import('@/components/HowItWorksPage'),
      'Mission': () => import('@/components/HaartransplantatieMissionPage'),
      'Contact': () => import('@/components/HaartransplantatieContactPage'),
    };

    // Trigger prefetch
    componentMap[tab]?.().catch(() => {
      // Silent fail - prefetching is optional
    });
  }, []);

  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab === optimisticTab);
    const activeTabElement = tabRefs.current[activeIndex];

    if (activeTabElement) {
      const containerRect = activeTabElement.parentElement?.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();

      if (containerRect) {
        setUnderlineStyle({
          left: tabRect.left - containerRect.left,
          width: tabRect.width,
        });
      }
    }
  }, [optimisticTab]);

  return (
    <div
      className="relative"
      style={{
        animation: 'fade-in 0.6s ease-out 0.6s both',
      }}
    >
      <div className="flex items-center gap-6 px-4 relative">
        {tabs.map((tab, index) => {
          const isActive = optimisticTab === tab;
          return (
            <button
              key={tab}
              ref={(el) => { tabRefs.current[index] = el; }}
              onClick={() => handleTabClick(tab)}
              onMouseEnter={() => handleTabHover(tab)}
              className="relative transition-all duration-300 z-10"
              style={{
                paddingBottom: 'clamp(0.875rem, 1.5vh, 1.125rem)',
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 300,
                fontSize: 'clamp(11px, 1.3vh, 13px)',
                letterSpacing: '0.01em',
              }}
            >
              {tab}
            </button>
          );
        })}

        {/* Animated active indicator */}
        <div
          className="absolute z-20 transition-all duration-300 ease-out"
          style={{
            bottom: '0px',
            height: '2.5px',
            background: 'white',
            left: `${underlineStyle.left}px`,
            width: `${underlineStyle.width + 12}px`,
          }}
        />
      </div>

      {/* Full width baseline */}
      <div
        className="absolute left-4 right-4 z-0"
        style={{
          bottom: '0px',
          height: '2.5px',
          background: 'rgba(255, 255, 255, 0.2)',
        }}
      />
    </div>
  );
};
