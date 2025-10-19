import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface GlassTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ['Packages', 'Traject', 'Mission', 'Contact'];

export const GlassTabs = ({ activeTab, onTabChange }: GlassTabsProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  
  const getTabPath = (tab: string) => {
    const basePath = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
    const tabPaths: Record<string, string> = {
      'Packages': basePath,
      'Traject': `${basePath}/traject`,
      'Mission': `${basePath}/mission`,
      'Contact': `${basePath}/contact`,
    };
    return tabPaths[tab] || basePath;
  };
  
  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    navigate(getTabPath(tab));
  };
  
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab === activeTab);
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
  }, [activeTab]);
  
  return (
    <div 
      className="relative"
      style={{
        animation: 'fade-in 0.6s ease-out 0.6s both',
      }}
    >
      <div className="flex items-center gap-6 px-4 relative">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              ref={(el) => (tabRefs.current[index] = el)}
              onClick={() => handleTabClick(tab)}
              className="relative transition-all duration-300 z-10"
              style={{
                paddingBottom: 'clamp(0.625rem, 1.2vh, 0.875rem)',
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: isActive ? 400 : 300,
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
            height: '3px',
            background: 'white',
            left: `${underlineStyle.left - 8}px`,
            width: `${underlineStyle.width + 16}px`,
          }}
        />
      </div>
      
      {/* Full width baseline */}
      <div 
        className="absolute left-0 right-0 z-0"
        style={{
          bottom: '0px',
          height: '1px',
          background: 'rgba(255, 255, 255, 0.2)',
        }}
      />
    </div>
  );
};
