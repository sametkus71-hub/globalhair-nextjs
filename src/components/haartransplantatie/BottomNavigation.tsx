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

  const handleMissionNavigation = () => {
    // Store current page before navigating to mission
    sessionStorage.setItem('previousPage', location.pathname);
    handlePopupNavigation(language === 'nl' ? '/nl/missie' : '/en/mission');
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
    if (path === 'contact') {
      return location.pathname === '/nl/contact' || location.pathname === '/en/contact';
    }
    return false;
  };

  const navItems = [
    { 
      iconSrc: '/lovable-uploads/04aab7a8-e1ff-45f4-a726-51acc3e02a41.png',
      onClick: handleHomeClick,
      id: 'home'
    },
    { 
      iconSrc: '/lovable-uploads/75185e09-91f9-4292-90d7-fd4371d2ab23.png',
      onClick: handleMissionNavigation,
      id: 'mission'
    },
    { 
      iconSrc: '/lovable-uploads/4f77654b-737b-493a-a695-ad8360dbeb0d.png',
      onClick: () => {},
      id: 'book'
    },
    { 
      iconSrc: '/lovable-uploads/49617091-42a9-4433-bd8b-df560cd352ac.png',
      onClick: () => handlePopupNavigation(language === 'nl' ? '/nl/reviews' : '/en/reviews'),
      id: 'reviews'
    },
    { 
      iconSrc: '/lovable-uploads/b5004700-4ebf-4a8d-9f10-fcddc2176942.png',
      onClick: () => handlePopupNavigation(language === 'nl' ? '/nl/contact' : '/en/contact'),
      id: 'contact'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-[10000] h-14">
      <div 
        className="bg-black h-full flex items-center justify-center px-2 pb-2"
        style={{ 
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.5rem)'
        }}
      >
        <div className="flex items-center justify-between w-full max-w-sm px-1">
          {navItems.map((item, index) => {
            const active = isActive(item.id);
            const isBookButton = item.id === 'book';
            
            return (
              <div key={index} className={`flex-1 flex justify-center ${isBookButton ? 'relative' : ''}`}>
                <button
                  onClick={item.onClick}
                  className={`flex items-center justify-center transition-all duration-200 ${
                    isBookButton 
                      ? 'rounded-full w-12 h-12 shadow-lg backdrop-blur-sm bg-white/10 border border-white/20 booking-button-glow' 
                      : 'p-2'
                  }`}
                >
                  <img 
                    src={item.iconSrc}
                    alt={`${item.id} icon`}
                    className={`brightness-0 invert ${isBookButton ? 'w-10 h-10' : 'w-5 h-5'}`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};