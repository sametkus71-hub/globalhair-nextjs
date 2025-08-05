import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/PageTransition';

const V6HairboostPage = () => {
  const { language } = useLanguage();

  return (
    <>
      <MetaHead language={language} page="v6hairboost" />
      <PageTransition isNewPage={true}>
        <div className="min-h-screen bg-gradient-hero flex flex-col">
          {/* Navigation */}
          <nav 
            className="p-6 border-b border-gray-200 page-entry-item page-entry-delay-1"
            data-page-entry="nav"
          >
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
            <div className="text-center space-y-6">
              <div 
                className="page-entry-item page-entry-delay-2"
                data-page-entry="title"
              >
                <h1 className="text-4xl font-header font-bold text-gray-800 mb-4">
                  V6 Hairboost
                </h1>
              </div>
              
              <div 
                className="page-entry-item page-entry-delay-3"
                data-page-entry="subtitle"
              >
                <p className="text-xl text-gray-600 mb-8">
                  {language === 'nl' 
                    ? 'Binnenkort beschikbaar'
                    : 'Coming soon'
                  }
                </p>
              </div>
              
              <div 
                className="page-entry-item page-entry-delay-4"
                data-page-entry="button"
              >
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={() => window.history.back()}
                  className="font-header transform hover:scale-105 transition-transform duration-200"
                >
                  {language === 'nl' ? 'Terug naar hoofdpagina' : 'Back to homepage'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default V6HairboostPage;