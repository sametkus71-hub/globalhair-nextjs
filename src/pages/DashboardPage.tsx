import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { useTranslation } from '@/lib/translations';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardPage = () => {
  const { language } = useLanguage();
  const { profile } = useSession();
  const { t } = useTranslation(language);
  const navigate = useNavigate();

  return (
    <>
      <SEOHead title="Dashboard" description="GlobalHair Institute Dashboard" noIndex={true} />
      <div className="min-h-[var(--app-height)] bg-gradient-hero">
        {/* Navigation */}
        <nav className="p-6 border-b border-gray-200">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="font-header text-2xl font-bold text-primary">
              GlobalHair Dashboard
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              ← {language === 'nl' ? 'Terug' : 'Back'}
            </Button>
          </div>
        </nav>

        <div className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-header font-bold text-gray-800 mb-4">
                {language === 'nl' ? 'Welkom in uw persoonlijke dashboard' : 'Welcome to your personal dashboard'}
              </h1>
              <p className="text-xl text-gray-600">
                {language === 'nl' 
                  ? 'Beheer uw behandelingen en bekijk uw voortgang'
                  : 'Manage your treatments and view your progress'
                }
              </p>
            </div>

            {/* User Profile Card */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="font-header">
                    {language === 'nl' ? 'Uw Profiel' : 'Your Profile'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'nl' ? 'Geslacht:' : 'Gender:'}</span>
                    <span className="font-semibold">{profile.geslacht}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'nl' ? 'Haartype:' : 'Hair Type:'}</span>
                    <span className="font-semibold">{profile.haartype}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'nl' ? 'Haarkleur:' : 'Hair Color:'}</span>
                    <span className="font-semibold">{profile.haarkleur}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="font-header">
                    {language === 'nl' ? 'Komende Afspraken' : 'Upcoming Appointments'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {language === 'nl' 
                      ? 'Geen afspraken gepland. Boek uw eerste behandeling!'
                      : 'No appointments scheduled. Book your first treatment!'
                    }
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="font-header">
                    {language === 'nl' ? 'Voortgang' : 'Progress'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {language === 'nl' 
                      ? 'Nog geen behandelingen. Start vandaag nog!'
                      : 'No treatments yet. Start today!'
                    }
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-header font-semibold text-gray-800">
                {language === 'nl' ? 'Snelle Acties' : 'Quick Actions'}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg"
                  className="font-header bg-gradient-primary"
                  onClick={() => navigate(language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant')}
                >
                  {language === 'nl' ? 'Boek Haartransplantatie' : 'Book Hair Transplant'}
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="font-header"
                  onClick={() => navigate(language === 'nl' ? '/nl/v6-hairboost' : '/en/v6-hairboost')}
                >
                  {language === 'nl' ? 'Boek V6 Hairboost®' : 'Book V6 Hairboost®'}
                </Button>
                <Button 
                  size="lg"
                  variant="secondary"
                  className="font-header"
                  onClick={() => navigate(language === 'nl' ? '/nl/form' : '/en/form')}
                >
                  {language === 'nl' ? 'Haaranalyse' : 'Hair Analysis'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;