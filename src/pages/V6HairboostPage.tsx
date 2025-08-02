import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { MetaHead } from '@/components/MetaHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const V6HairboostPage = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <>
      <MetaHead language={language} page="v6hairboost" />
      <div className="min-h-screen bg-gradient-hero">
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

        {/* Hero Section */}
        <div className="py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-header font-bold text-gray-800 mb-6">
              {t('page.v6hairboost.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'nl' 
                ? 'Revolutionaire haargroei behandeling met V6 Hairboost technologie voor optimale resultaten.'
                : 'Revolutionary hair growth treatment with V6 Hairboost technology for optimal results.'
              }
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="font-header text-xl">
                    {language === 'nl' ? 'V6 Technologie' : 'V6 Technology'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {language === 'nl' 
                      ? 'Geavanceerde 6-dimensionale haargroei stimulatie voor maximale effectiviteit.'
                      : 'Advanced 6-dimensional hair growth stimulation for maximum effectiveness.'
                    }
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="font-header text-xl">
                    {language === 'nl' ? 'Snelle Resultaten' : 'Fast Results'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {language === 'nl' 
                      ? 'Zichtbare verbetering binnen 4-6 weken na de eerste behandeling.'
                      : 'Visible improvement within 4-6 weeks after the first treatment.'
                    }
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="font-header text-xl">
                    {language === 'nl' ? 'Pijnloze Behandeling' : 'Painless Treatment'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {language === 'nl' 
                      ? 'Comfortabele en niet-invasieve behandeling zonder downtime.'
                      : 'Comfortable and non-invasive treatment with no downtime.'
                    }
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-header font-bold text-center text-gray-800 mb-12">
              {language === 'nl' ? 'Behandelingsproces' : 'Treatment Process'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                  1
                </div>
                <h3 className="font-header text-lg font-semibold mb-2">
                  {language === 'nl' ? 'Analyse' : 'Analysis'}
                </h3>
                <p className="text-gray-600">
                  {language === 'nl' 
                    ? 'Uitgebreide haaranalyse en persoonlijk behandelplan'
                    : 'Comprehensive hair analysis and personal treatment plan'
                  }
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                  2
                </div>
                <h3 className="font-header text-lg font-semibold mb-2">
                  {language === 'nl' ? 'Behandeling' : 'Treatment'}
                </h3>
                <p className="text-gray-600">
                  {language === 'nl' 
                    ? 'V6 Hairboost sessie met geavanceerde technologie'
                    : 'V6 Hairboost session with advanced technology'
                  }
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                  3
                </div>
                <h3 className="font-header text-lg font-semibold mb-2">
                  {language === 'nl' ? 'Resultaten' : 'Results'}
                </h3>
                <p className="text-gray-600">
                  {language === 'nl' 
                    ? 'Follow-up en optimalisatie van resultaten'
                    : 'Follow-up and optimization of results'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 px-6 bg-gradient-secondary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-header font-bold mb-6">
              {language === 'nl' 
                ? 'Start vandaag nog met V6 Hairboost'
                : 'Start with V6 Hairboost today'
              }
            </h2>
            <Button 
              variant="outline" 
              size="lg"
              className="font-header text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-gray-800"
            >
              {language === 'nl' ? 'Boek Behandeling' : 'Book Treatment'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default V6HairboostPage;