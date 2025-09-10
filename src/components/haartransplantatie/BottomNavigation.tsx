import { useLanguage } from '@/hooks/useLanguage';
import { usePopupTransition } from '@/hooks/usePopupTransition';
import { useLocation } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { BackIcon } from '@/components/icons/BackIcon';
import { ShieldIcon } from '@/components/logos/ShieldIcon';

interface NavItemBase {
  onClick: () => void;
  id: string;
}

interface NavItemWithIcon extends NavItemBase {
  isCustomIcon: false;
  iconSrc: string;
}

interface NavItemWithCustomIcon extends NavItemBase {
  isCustomIcon: true;
  iconComponent: React.ComponentType<{ className?: string }>;
}

type NavItem = NavItemWithIcon | NavItemWithCustomIcon;

// Type guard functions
const isNavItemWithIcon = (item: NavItem): item is NavItemWithIcon => {
  return !item.isCustomIcon;
};

const isNavItemWithCustomIcon = (item: NavItem): item is NavItemWithCustomIcon => {
  return item.isCustomIcon;
};

export const BottomNavigation = () => {
  const { language } = useLanguage();
  const { activeRoute } = useSession();
  
  const location = useLocation();
  const { startPopupTransition, directNavigate, isOnPopupPage } = usePopupTransition();

  // Check if we're on a main service page
  const isOnMainPage = () => {
    return location.pathname.includes('/haartransplantatie') || 
           location.pathname.includes('/hair-transplant') ||
           location.pathname.includes('/v6-hairboost');
  };

  // Get the target path for the active route
  const getActiveRoutePath = () => {
    if (activeRoute === 'haartransplantatie') {
      return language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
    }
    if (activeRoute === 'v6-hairboost') {
      return `/${language}/v6-hairboost`;
    }
    return language === 'nl' ? '/nl' : '/en';
  };

  const handleHomeClick = () => {
    if (isOnMainPage()) {
      // If on main page, go back to intro
      directNavigate(language === 'nl' ? '/nl' : '/en');
    } else {
      // If on other pages, go to active route or intro
      const targetPath = activeRoute ? getActiveRoutePath() : (language === 'nl' ? '/nl' : '/en');
      if (!isOnPopupPage()) {
        sessionStorage.setItem('previousPath', location.pathname);
      }
      directNavigate(targetPath);
    }
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

  const handleBookingNavigation = () => {
    // Store current page before navigating to booking
    sessionStorage.setItem('previousPage', location.pathname);
    handlePopupNavigation(language === 'nl' ? '/nl/boek' : '/en/book');
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
    if (path === 'book') {
      return location.pathname === '/nl/boek' || location.pathname === '/en/book';
    }
    return false;
  };

  // Get home button configuration
  const getHomeButtonConfig = (): NavItem => {
    if (isOnMainPage()) {
      // Show back to intro icon on main pages
      return {
        isCustomIcon: false,
        iconSrc: '/lovable-uploads/a52a13c1-8ed7-42d9-a898-ed591ddac684.png',
        onClick: handleHomeClick,
        id: 'home'
      };
    } else {
      // Show active route logo or default home icon
      let logoSrc = '/lovable-uploads/04aab7a8-e1ff-45f4-a726-51acc3e02a41.png';
      
      if (activeRoute === 'haartransplantatie') {
        // Use haartransplantatie shield icon (bigger, no text)
        return {
          isCustomIcon: true,
          iconComponent: ShieldIcon,
          onClick: handleHomeClick,
          id: 'home'
        };
      } else if (activeRoute === 'v6-hairboost') {
        // Use v6-hairboost logo - we'll use a placeholder for now
        logoSrc = '/lovable-uploads/04aab7a8-e1ff-45f4-a726-51acc3e02a41.png';
      }
      
      return {
        isCustomIcon: false,
        iconSrc: logoSrc,
        onClick: handleHomeClick,
        id: 'home'
      };
    }
  };

  const homeButtonConfig = getHomeButtonConfig();

  const navItems: NavItem[] = [
    homeButtonConfig,
    { 
      isCustomIcon: false,
      iconSrc: '/lovable-uploads/75185e09-91f9-4292-90d7-fd4371d2ab23.png',
      onClick: handleMissionNavigation,
      id: 'mission'
    },
    { 
      isCustomIcon: false,
      iconSrc: '/lovable-uploads/4f77654b-737b-493a-a695-ad8360dbeb0d.png',
      onClick: handleBookingNavigation,
      id: 'book'
    },
    { 
      isCustomIcon: false,
      iconSrc: '/lovable-uploads/49617091-42a9-4433-bd8b-df560cd352ac.png',
      onClick: () => handlePopupNavigation(language === 'nl' ? '/nl/reviews' : '/en/reviews'),
      id: 'reviews'
    },
    { 
      isCustomIcon: false,
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
            const isHomeButton = item.id === 'home';
            
            return (
              <div key={index} className="w-14 flex justify-center">
                <button
                  onClick={item.onClick}
                  className="flex items-center justify-center transition-all duration-200 w-14 h-14"
                >
                  {isNavItemWithCustomIcon(item) ? (
                    <div className="w-7 h-7 flex items-center justify-center pt-4">
                      <item.iconComponent className="brightness-0 invert w-7 h-7" />
                    </div>
                  ) : (
                    <img 
                      src={item.iconSrc}
                      alt={`${item.id} icon`}
                      className="brightness-0 invert w-7 h-7"
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};