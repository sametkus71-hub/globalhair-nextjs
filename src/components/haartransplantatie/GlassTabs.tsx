import { useState } from 'react';

interface GlassTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ['Packages', 'Traject', 'Mission', 'Contact'];

export const GlassTabs = ({ activeTab, onTabChange }: GlassTabsProps) => {
  const activeIndex = tabs.findIndex(tab => tab === activeTab);
  
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
            left: `calc(${activeIndex * 25}% + 1rem)`,
            width: `calc(${100 / tabs.length}% - 1.5rem)`,
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
