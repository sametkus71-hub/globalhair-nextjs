import { useLanguage } from '@/hooks/useLanguage';
import { usePopupTransition } from '@/hooks/usePopupTransition';
import { useLocation } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { GridIcon } from '@/components/icons/GridIcon';
import { HaarscanIcon } from '@/components/icons/HaarscanIcon';
import { BookIcon } from '@/components/icons/BookIcon';
import { ReviewIcon } from '@/components/icons/ReviewIcon';
import { ContactIcon } from '@/components/icons/ContactIcon';

interface NavItem {
  onClick: () => void;
  id: string;
  iconComponent: React.ComponentType<{ className?: string }>;
  labelKey: string;
}

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

  // Check if we're on the main haartransplantatie page (not popup pages)
  const isOnMainHaartransplantatiePage = () => {
    return location.pathname === '/nl/haartransplantatie' || 
           location.pathname === '/en/hair-transplant';
  };

  // Get opacity class based on current page and active state
  const getOpacityClass = (itemId: string, isActive: boolean) => {
    // Home button always gets full opacity
    if (itemId === 'home') {
      return 'opacity-100';
    }
    
    // If on main haartransplantatie page, all items get full opacity
    if (isOnMainHaartransplantatiePage()) {
      return 'opacity-100';
    }
    
    // If on popup pages, only active item gets full opacity, others dimmed
    return isActive ? 'opacity-100' : 'opacity-50';
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

  const handleHaarscanNavigation = () => {
    // Store current page before navigating to haarscan
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
    if (path === 'haarscan') {
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
      // Show grid icon on main pages
      return {
        iconComponent: GridIcon,
        onClick: handleHomeClick,
        id: 'home',
        labelKey: 'home'
      };
    } else {
      // Show home icon on other pages
      return {
        iconComponent: HomeIcon,
        onClick: handleHomeClick,
        id: 'home',
        labelKey: 'home'
      };
    }
  };

  const homeButtonConfig = getHomeButtonConfig();

  const navItems: NavItem[] = [
    homeButtonConfig,
    { 
      iconComponent: HaarscanIcon,
      onClick: handleHaarscanNavigation,
      id: 'haarscan',
      labelKey: 'haarscan'
    },
    { 
      iconComponent: BookIcon,
      onClick: handleBookingNavigation,
      id: 'book',
      labelKey: 'book'
    },
    { 
      iconComponent: ReviewIcon,
      onClick: () => handlePopupNavigation(language === 'nl' ? '/nl/reviews' : '/en/reviews'),
      id: 'reviews',
      labelKey: 'review'
    },
    { 
      iconComponent: ContactIcon,
      onClick: () => handlePopupNavigation(language === 'nl' ? '/nl/contact' : '/en/contact'),
      id: 'contact',
      labelKey: 'contact'
    }
  ];

  const getLabel = (labelKey: string) => {
    const labels = {
      home: language === 'nl' ? 'Home' : 'Home',
      haarscan: language === 'nl' ? 'Haarscan' : 'Haarscan',
      book: language === 'nl' ? 'Book' : 'Book',
      review: language === 'nl' ? 'Review' : 'Review',
      contact: language === 'nl' ? 'Contact' : 'Contact'
    };
    return labels[labelKey as keyof typeof labels] || labelKey;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-[10000] h-16">
      <div 
        className="bg-black h-full flex items-center justify-center px-2 pb-1"
        style={{ 
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.25rem)'
        }}
      >
        <div className="flex items-center justify-between w-full max-w-sm px-1">
          {navItems.map((item, index) => {
            const active = isActive(item.id);
            
            return (
              <div key={index} className="flex-1 flex justify-center">
                <button
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center transition-all duration-200 py-1 px-2"
                >
                  <div className={`w-6 h-6 flex items-center justify-center transition-opacity duration-200 ${getOpacityClass(item.id, active)}`}>
                    <item.iconComponent className={`brightness-0 invert transition-opacity duration-200 ${
                      item.id === 'home' ? 'w-5 h-5' :
                      item.id === 'haarscan' ? 'w-7 h-7' :
                      item.id === 'book' ? 'w-12 h-12' :
                      item.id === 'reviews' ? 'w-7 h-7' :
                      'w-6 h-6'
                    }`} />
                  </div>
                  <span 
                    className={`transition-opacity duration-200 ${getOpacityClass(item.id, active)}`}
                    style={{
                      color: 'rgba(189, 189, 189, 1)',
                      fontFamily: 'Lato',
                      fontWeight: 500,
                      fontSize: '8px',
                      lineHeight: '100%',
                      letterSpacing: '-2%',
                      marginTop: '2px'
                    }}
                  >
                    {getLabel(item.labelKey)}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};