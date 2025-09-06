import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

const InfoTrajectoryPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    setIsExiting(true);
    // Get previous path or default to info
    const previousPath = sessionStorage.getItem('previousPath') || 
                        (language === 'nl' ? '/nl/info' : '/en/info');
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      sessionStorage.removeItem('previousPath');
      navigate(previousPath);
    }, 300);
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      <MetaHead 
        title={language === 'nl' ? 'Behandel Traject' : 'Treatment Trajectory'}
        description={language === 'nl' ? 'Informatie over behandeltrajecten' : 'Information about treatment trajectories'}
        language={language}
      />
      <div className={`info-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'slide-exit-right' : 'slide-enter-left'}`}>
        {/* Background matching parent */}
        <div className="min-h-[var(--app-height)]" style={{ background: '#E4E5E0' }}>
          
          {/* Back button */}
          <button
            onClick={handleBack}
            className="fixed top-4 left-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors transform hover:scale-105 active:scale-95"
            aria-label={language === 'nl' ? 'Terug' : 'Back'}
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          {/* Content */}
          <div className="flex flex-col items-center justify-center min-h-[var(--app-height)] px-6 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
                {language === 'nl' ? 'Behandel Traject' : 'Treatment Trajectory'}
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {language === 'nl' 
                  ? 'Informatie over onze behandeltrajecten komt hier'
                  : 'Information about our treatment trajectories will be here'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoTrajectoryPage;