import React from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';

const SupportPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <>
      <MetaHead 
        title={language === 'nl' ? 'Ondersteuning' : 'Support'}
        description={language === 'nl' ? 'Ondersteuning pagina' : 'Support page'}
        language={language}
      />
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            {language === 'nl' ? 'Ondersteuning' : 'Support'}
          </h1>
          {/* Content will be added later */}
        </div>
      </div>
    </>
  );
};

export default SupportPage;