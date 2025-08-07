import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { usePopupClose } from '@/hooks/usePopupClose';
import { MissionContent } from '@/components/mission/MissionContent';
import { MissionTextArea } from '@/components/mission/MissionTextArea';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';

export const MissionPage = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [isExiting, setIsExiting] = useState(false);
  const { handleClose: handlePopupClose } = usePopupClose();

  // Navigate back to appropriate page
  const handleClose = () => {
    setIsExiting(true);
    // Wait for animation to complete before navigating
    setTimeout(() => {
      handlePopupClose();
    }, 300);
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      <div className={`mission-page-scrollable ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="fixed top-4 left-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors transform hover:scale-105 active:scale-95"
          aria-label={t('mission.close')}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Video Section */}
        <div className="w-full aspect-video bg-gray-100 relative flex items-center justify-center">
          {/* Video Placeholder */}
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 py-12 bg-white">
          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
            Our mission, your well being
          </h1>

          {/* Subtitle */}
          <h2 className="text-xl md:text-2xl text-gray-700 mb-8 font-medium">
            Tell us everything about what you desire
          </h2>

          {/* Body Text */}
          <div className="text-gray-800 text-base md:text-lg leading-relaxed space-y-6 mb-12">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>

            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
            </p>

            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
            </p>

            <p>
              Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque.
            </p>

            <p>
              Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.
            </p>

            <p>
              Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          {/* Read More Button */}
          <button className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors">
            Read more...
          </button>

          {/* Extra spacing for testing scroll */}
          <div className="h-96"></div>
        </div>
      </div>
      
      {/* Bottom Navigation Portal */}
      <BottomNavigationPortal />
    </>
  );
};

export default MissionPage;