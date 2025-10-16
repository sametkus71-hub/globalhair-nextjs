import { useState } from 'react';

interface GlassTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ['Packages', 'Traject', 'Mission', 'Contact'];

export const GlassTabs = ({ activeTab, onTabChange }: GlassTabsProps) => {
  return (
    <div 
      className="relative flex items-center gap-6 px-4 py-3"
      style={{
        animation: 'fade-in 0.6s ease-out 0.6s both',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className="relative pb-2 transition-all duration-300"
            style={{
              color: isActive ? 'white' : 'rgba(255, 255, 255, 0.5)',
              fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
              fontWeight: isActive ? 600 : 400,
              fontSize: '15px',
              letterSpacing: '0.01em',
            }}
          >
            {tab}
            
            {/* Active indicator line */}
            {isActive && (
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '2px',
                  background: 'white',
                  animation: 'fade-in 0.3s ease-out',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
