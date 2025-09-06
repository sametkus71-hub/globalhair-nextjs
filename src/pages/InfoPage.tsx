import React from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';

const InfoPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <>
      <MetaHead 
        title={language === 'nl' ? 'Informatie' : 'Information'}
        description={language === 'nl' ? 'Informatie pagina' : 'Information page'}
        language={language}
      />
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            {language === 'nl' ? 'Informatie' : 'Information'}
          </h1>
          {/* Content will be added later */}
        </div>
      </div>
    </>
  );
};

export default InfoPage;