import { useLanguage } from '@/hooks/useLanguage';
import { usePopupTransition } from '@/hooks/usePopupTransition';
import { useLocation } from 'react-router-dom';

export const BottomNavigation = () => {
  const { language } = useLanguage();
  
  const location = useLocation();
  const { startPopupTransition, directNavigate, isOnPopupPage } = usePopupTransition();

  const handleHomeClick = () => {
    // Store current path before going home (only if not already a popup)
    if (!isOnPopupPage()) {
      sessionStorage.setItem('previousPath', location.pathname);
    }
    directNavigate(language === 'nl' ? '/nl' : '/en');
  };

  const handlePopupNavigation = (targetPath: string) => {
    const isCurrentlyOnPopup = isOnPopupPage();
    
    if (isCurrentlyOnPopup) {
      // Use fluid cross-fade transition for popup-to-popup navigation
      startPopupTransition(targetPath, false);
    } else {
      // Use original slide-up animation for opening from non-popup pages
      startPopupTransition(targetPath, true);
    }
  };

  const isActive = (path: string) => {
    if (path === 'home') {
      return location.pathname === '/nl' || location.pathname === '/en' || location.pathname === '/';
    }
    if (path === 'mission') {
      return location.pathname === '/nl/missie' || location.pathname === '/en/mission';
    }
    if (path === 'reviews') {
      return location.pathname.startsWith('/nl/reviews') || location.pathname.startsWith('/en/reviews');
    }
    return false; // Other pages not implemented yet
  };

  const navItems = [
    { 
      iconSrc: '/lovable-uploads/2b9e0bad-9af2-418e-9da5-61251fda9bf5.png',
      onClick: handleHomeClick,
      id: 'home'
    },
    { 
      iconSrc: '/lovable-uploads/1e4738b7-ae5c-4b74-bd8c-73364351bd6c.png',
      onClick: () => handlePopupNavigation(language === 'nl' ? '/nl/missie' : '/en/mission'),
      id: 'mission'
    },
    { 
      iconSrc: '/lovable-uploads/b4af7cd8-5300-4318-bda8-a95e185a1310.png',
      onClick: () => {},
      id: 'book'
    },
    { 
      iconSrc: '/lovable-uploads/f090962b-0f2c-4b17-9a77-c7a3d700434f.png',
      onClick: () => handlePopupNavigation(language === 'nl' ? '/nl/reviews' : '/en/reviews'),
      id: 'reviews'
    },
    { 
      iconSrc: '/lovable-uploads/54d5ba6c-7e60-4b15-8638-069720030225.png',
      onClick: () => {},
      id: 'contact'
    }
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 w-full z-[10000]"
      style={{ 
        height: '60px'
      }}
    >
      <div 
        className="bg-black/95 backdrop-blur-sm border-t border-gray-800/50 h-full"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-2">
          <div className="flex justify-around items-center">
            {navItems.map((item, index) => {
              const active = isActive(item.id);
              const isBookButton = item.id === 'book';
              
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`flex items-center justify-center p-3 min-w-0 transition-all duration-200 ${
                    isBookButton 
                      ? 'bg-white/10 backdrop-blur-sm rounded-full shadow-lg shadow-white/20 hover:bg-white/15' 
                      : 'hover:bg-white/5 rounded-lg'
                  }`}
                >
                  <img 
                    src={item.iconSrc}
                    alt={`${item.id} icon`}
                    className={`w-6 h-6 ${
                      active ? 'opacity-100' : 'opacity-70'
                    }`} 
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};