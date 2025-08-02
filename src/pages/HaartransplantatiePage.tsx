import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { MetaHead } from '@/components/MetaHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HaartransplantatiePage = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <>
      <MetaHead language={language} page="haartransplantatie" />
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
              {t('page.haartransplantatie.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'nl' 
                ? 'Ontdek onze geavanceerde haartransplantatie technieken voor natuurlijke en blijvende resultaten.'
                : 'Discover our advanced hair transplant techniques for natural and lasting results.'
              }
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="font-header text-xl">
                    {language === 'nl' ? 'FUE Techniek' : 'FUE Technique'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {language === 'nl' 
                      ? 'Follicular Unit Extraction - de meest geavanceerde techniek voor minimale littekens.'
                      : 'Follicular Unit Extraction - the most advanced technique for minimal scarring.'
                    }
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="font-header text-xl">
                    {language === 'nl' ? 'Natuurlijke Resultaten' : 'Natural Results'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {language === 'nl' 
                      ? 'Gepersonaliseerde aanpak voor de meest natuurlijke haargroei.'
                      : 'Personalized approach for the most natural hair growth.'
                    }
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="font-header text-xl">
                    {language === 'nl' ? 'Expert Team' : 'Expert Team'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {language === 'nl' 
                      ? 'Ervaren specialisten met jarenlange expertise in haartransplantatie.'
                      : 'Experienced specialists with years of expertise in hair transplantation.'
                    }
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 px-6 bg-gradient-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-header font-bold mb-6">
              {language === 'nl' 
                ? 'Klaar voor een gepersonaliseerde consultatie?'
                : 'Ready for a personalized consultation?'
              }
            </h2>
            <Button 
              variant="secondary" 
              size="lg"
              className="font-header text-lg px-8 py-3"
            >
              {language === 'nl' ? 'Plan Consultatie' : 'Schedule Consultation'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HaartransplantatiePage;