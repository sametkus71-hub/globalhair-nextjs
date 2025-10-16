import { useState } from 'react';

interface GlassTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ['Packages', 'Traject', 'Mission', 'Contact'];

export const GlassTabs = ({ activeTab, onTabChange }: GlassTabsProps) => {
  return (
    <div 
      className="relative px-4"
      style={{
        animation: 'fade-in 0.6s ease-out 0.6s both',
      }}
    >
      <div className="flex items-center gap-6 py-3">
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
            </button>
          );
        })}
      </div>
      
      {/* Full width baseline */}
      <div 
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '1px',
          background: 'rgba(255, 255, 255, 0.2)',
        }}
      />
      
      {/* Active indicator - thicker white line */}
      {tabs.map((tab, index) => {
        if (activeTab === tab) {
          return (
            <div
              key={tab}
              className="absolute bottom-0 transition-all duration-300"
              style={{
                left: `${16 + index * (100 / tabs.length) * 0.85}px`,
                width: `${tab.length * 9}px`,
                height: '3px',
                background: 'white',
                animation: 'fade-in 0.3s ease-out',
              }}
            />
          );
        }
        return null;
      })}
    </div>
  );
};
