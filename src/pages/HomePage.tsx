import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession, Gender, HairType, HairColor } from '@/hooks/useSession';
import { useTranslation } from '@/lib/translations';
import { MetaHead } from '@/components/MetaHead';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useSession();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Add fullscreen class to body
    document.body.classList.add('fullscreen-no-scroll');
    
    return () => {
      document.body.classList.remove('fullscreen-no-scroll');
    };
  }, []);

  const genderOptions: Gender[] = ['Man', 'Vrouw'];
  const hairTypeOptions: HairType[] = ['Fijn', 'Stijl', 'Krul', 'Kroes'];
  const hairColorOptions: HairColor[] = ['Zwart', 'Bruin', 'Blond', 'Rood'];

  const handleSelection = (field: keyof typeof profile, value: string) => {
    updateProfile(field, value);
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const handleContinue = () => {
    const path = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
    navigate(path);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-header text-gray-700">{t('home.select.gender')}</h2>
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              {genderOptions.map((gender) => (
                <div
                  key={gender}
                  className={`hero-tile p-8 ${profile.geslacht === gender ? 'selected' : ''}`}
                  onClick={() => handleSelection('geslacht', gender)}
                >
                  <div className="text-6xl mb-4">
                    {gender === 'Man' ? '👨' : '👩'}
                  </div>
                  <div className="font-header text-lg">{t(`gender.${gender.toLowerCase()}`)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-header text-gray-700">{t('home.select.hairtype')}</h2>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {hairTypeOptions.map((hairType) => (
                <div
                  key={hairType}
                  className={`hero-tile p-6 ${profile.haartype === hairType ? 'selected' : ''}`}
                  onClick={() => handleSelection('haartype', hairType)}
                >
                  <div className="text-4xl mb-3">
                    {hairType === 'Fijn' && '🧑‍🦱'}
                    {hairType === 'Stijl' && '🧑‍🦲'}
                    {hairType === 'Krul' && '🧑‍🦱'}
                    {hairType === 'Kroes' && '👩‍🦱'}
                  </div>
                  <div className="font-header text-sm">{t(`hairtype.${hairType.toLowerCase()}`)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-header text-gray-700">{t('home.select.haircolor')}</h2>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {hairColorOptions.map((hairColor) => (
                <div
                  key={hairColor}
                  className={`hero-tile p-6 ${profile.haarkleur === hairColor ? 'selected' : ''}`}
                  onClick={() => handleSelection('haarkleur', hairColor)}
                >
                  <div className="w-12 h-12 rounded-full mx-auto mb-3" style={{
                    backgroundColor: 
                      hairColor === 'Zwart' ? '#1a1a1a' :
                      hairColor === 'Bruin' ? '#8B4513' :
                      hairColor === 'Blond' ? '#F5DEB3' :
                      '#CD853F'
                  }}></div>
                  <div className="font-header text-sm">{t(`haircolor.${hairColor.toLowerCase()}`)}</div>
                </div>
              ))}
            </div>
            <div className="pt-8">
              <Button 
                onClick={handleContinue}
                className="bg-gradient-primary hover:shadow-strong transition-all duration-300 px-8 py-3 text-lg font-header"
              >
                {t('home.continue')}
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <MetaHead language={language} page="home" />
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-8">
        {/* Logo */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <div className="font-header text-4xl font-bold text-primary">
            GlobalHair
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center w-full max-w-4xl">
          {step === 0 && (
            <div className="text-center space-y-12">
              <div>
                <h1 className="text-5xl font-header font-bold text-gray-800 mb-4">
                  {t('home.title')}
                </h1>
                <p className="text-xl text-gray-600 font-body">
                  {t('home.subtitle')}
                </p>
              </div>
              {renderStep()}
            </div>
          )}
          
          {step > 0 && renderStep()}
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                i <= step ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;