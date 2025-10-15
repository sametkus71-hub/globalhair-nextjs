import { useState } from 'react';

interface GlassTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ['Packages', 'Traject', 'Mission', 'Contact'];

export const GlassTabs = ({ activeTab, onTabChange }: GlassTabsProps) => {
  return (
    <div 
      className="flex items-center rounded-full p-0.5"
      style={{
        animation: 'fade-in 0.6s ease-out 0.6s both',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.20)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className="flex-1 py-2 px-2 rounded-full transition-all duration-300 relative"
            style={{
              background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
              boxShadow: isActive ? '0 4px 15px rgba(0, 0, 0, 0.3)' : 'none',
              color: 'white',
              fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
              fontWeight: isActive ? 600 : 400,
              fontSize: '13px',
            }}
          >
            {tab}
            
            {/* Active indicator line */}
            {isActive && (
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                style={{
                  width: '40%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, white, transparent)',
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
