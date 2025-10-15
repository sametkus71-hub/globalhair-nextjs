import { useState } from 'react';

interface GlassTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ['Packages', 'Traject', 'Mission', 'Contact'];

export const GlassTabs = ({ activeTab, onTabChange }: GlassTabsProps) => {
  return (
    <div 
      className="w-full px-4 py-4"
      style={{
        animation: 'fade-in 0.6s ease-out 0.8s both',
      }}
    >
      <div className="flex items-center justify-between border-b border-white/10">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="relative px-4 py-3 transition-all duration-300"
              style={{
                color: isActive ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {tab}
              
              {/* Active indicator */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                  style={{
                    animation: 'slide-in 0.3s ease-out',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: scaleX(0);
            opacity: 0;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
