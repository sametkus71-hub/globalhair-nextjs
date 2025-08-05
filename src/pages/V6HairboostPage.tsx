import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { Button } from '@/components/ui/button';

const V6HairboostPage = () => {
  const { language } = useLanguage();

  return (
    <>
      <MetaHead language={language} page="v6hairboost" />
      <div className="min-h-screen bg-gradient-hero flex flex-col">
        {/* Navigation */}
        <nav className="p-6 border-b border-gray-200">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="font-header text-2xl font-bold text-primary">
              GlobalHair
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              ← {language === 'nl' ? 'Terug' : 'Back'}
            </Button>
          </div>
        </nav>

        {/* Main content - centered */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-4xl font-header font-bold text-gray-800 mb-4">
              V6 Hairboost
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {language === 'nl' 
                ? 'Binnenkort beschikbaar'
                : 'Coming soon'
              }
            </p>
            <Button 
              variant="default" 
              size="lg"
              onClick={() => window.history.back()}
              className="font-header"
            >
              {language === 'nl' ? 'Terug naar hoofdpagina' : 'Back to homepage'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default V6HairboostPage;