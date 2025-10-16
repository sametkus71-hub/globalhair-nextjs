import { useState } from 'react';

interface GlassTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ['Packages', 'Traject', 'Mission', 'Contact'];

export const GlassTabs = ({ activeTab, onTabChange }: GlassTabsProps) => {
  return (
    <div 
      className="relative"
      style={{
        animation: 'fade-in 0.6s ease-out 0.6s both',
      }}
    >
      <div className="flex items-center gap-6 px-4">
        {tabs.map((tab) => {
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
              
              {/* Active indicator - thicker section of the baseline */}
              {isActive && (
                <div
                  className="absolute left-0 right-0 z-20"
                  style={{
                    bottom: '0px',
                    height: '3px',
                    background: 'white',
                    animation: 'fade-in 0.3s ease-out',
                  }}
                />
              )}
            </button>
          );
        })}
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
