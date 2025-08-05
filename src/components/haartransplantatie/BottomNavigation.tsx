import { useLanguage } from '@/hooks/useLanguage';
import { Home, Target, Calendar, MessageSquareText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNavigation = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    navigate(language === 'nl' ? '/nl' : '/en');
  };

  const isActive = (path: string) => {
    if (path === 'home') {
      return location.pathname === '/nl' || location.pathname === '/en' || location.pathname === '/';
    }
    return false; // Other pages not implemented yet
  };

  const navItems = [
    { 
      icon: Home, 
      label: 'Home', 
      onClick: handleHomeClick,
      id: 'home'
    },
    { 
      icon: Target, 
      label: language === 'nl' ? 'Missie' : 'Mission', 
      onClick: () => {},
      id: 'mission'
    },
    { 
      icon: Calendar, 
      label: 'Book', 
      onClick: () => {},
      id: 'book'
    },
    { 
      icon: MessageSquareText, 
      label: 'Reviews', 
      onClick: () => {},
      id: 'reviews'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div 
        className="bg-black/95 backdrop-blur-sm border-t border-gray-800/50"
        style={{ 
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))'
        }}
      >
        <div className="max-w-lg mx-auto px-2 pt-2 pb-1">
          <div className="flex justify-around items-center">
            {navItems.map((item, index) => {
              const active = isActive(item.id);
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="flex flex-col items-center space-y-1 p-2 min-w-0"
                >
                  <item.icon className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-400'}`} />
                  <span className={`text-[11px] leading-none ${active ? 'text-white font-bold' : 'text-gray-400 font-normal'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};