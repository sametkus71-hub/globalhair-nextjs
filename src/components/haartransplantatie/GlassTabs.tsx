import { useState, useRef, useEffect } from 'react';

interface GlassTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ['Packages', 'Traject', 'Mission', 'Contact'];

export const GlassTabs = ({ activeTab, onTabChange }: GlassTabsProps) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  
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
              onClick={() => onTabChange(tab)}
              className="relative pb-3 transition-all duration-300 z-10"
              style={{
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                fontWeight: isActive ? 600 : 400,
                fontSize: '12px',
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
            left: `${underlineStyle.left}px`,
            width: `${underlineStyle.width}px`,
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
