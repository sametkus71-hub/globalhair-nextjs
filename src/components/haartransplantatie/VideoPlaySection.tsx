import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export const VideoPlaySection = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 text-center space-y-8">
      {/* Large Play Button */}
      <div className="flex justify-center">
        <button className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
          <Play className="w-8 h-8 sm:w-12 sm:h-12 text-white ml-1" fill="currentColor" />
        </button>
      </div>

      {/* Cost Display */}
      <div className="space-y-2">
        <p className="text-sm text-gray-400">
          {language === 'nl' ? 'Geschatte kosten:' : 'Estimated cost:'}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-white">
          EUR 12.000
        </p>
      </div>

      {/* Style Selector */}
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          {language === 'nl' ? 'Haarkeuze:' : 'Hair choice:'}
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            {language === 'nl' ? 'Fijn' : 'Fine'}
          </Button>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            {language === 'nl' ? 'Stijl' : 'Style'}
          </Button>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            {language === 'nl' ? 'Krul' : 'Curly'}
          </Button>
        </div>
      </div>
    </div>
  );
};