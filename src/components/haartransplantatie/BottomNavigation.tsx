import { useLanguage } from '@/hooks/useLanguage';
import { Home, Target, BookOpen, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BottomNavigation = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate(language === 'nl' ? '/nl' : '/en');
  };

  const navItems = [
    { 
      icon: Home, 
      label: 'Home', 
      onClick: handleHomeClick 
    },
    { 
      icon: Target, 
      label: language === 'nl' ? 'Missie' : 'Mission', 
      onClick: () => {} 
    },
    { 
      icon: BookOpen, 
      label: 'Book', 
      onClick: () => {} 
    },
    { 
      icon: Star, 
      label: 'Reviews', 
      onClick: () => {} 
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div 
        className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50"
        style={{ 
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'
        }}
      >
        <div className="max-w-lg mx-auto px-4 pt-3 pb-2">
          <div className="flex justify-around items-center">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="flex flex-col items-center space-y-1 p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <item.icon className="w-5 h-5 text-gray-300" />
                <span className="text-xs text-gray-300">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};