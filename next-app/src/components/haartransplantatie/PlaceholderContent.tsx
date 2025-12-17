'use client';

import { useLanguage } from '@/hooks/useLanguage';

interface PlaceholderContentProps {
  type: 'Traject' | 'Mission' | 'Contact';
}

export const PlaceholderContent = ({ type }: PlaceholderContentProps) => {
  const { language } = useLanguage();

  const content = {
    Traject: {
      nl: {
        title: 'Jouw behandeltraject',
        items: ['Intake gesprek', 'Behandeling', 'Nazorg'],
      },
      en: {
        title: 'Your treatment journey',
        items: ['Intake consultation', 'Treatment', 'Aftercare'],
      },
    },
    Mission: {
      nl: {
        title: 'Onze missie',
        items: [
          'Hoogste kwaliteit haartransplantaties',
          'Persoonlijke begeleiding',
          'Natuurlijke resultaten',
        ],
      },
      en: {
        title: 'Our mission',
        items: [
          'Highest quality hair transplants',
          'Personal guidance',
          'Natural results',
        ],
      },
    },
    Contact: {
      nl: {
        title: 'Neem contact op',
        items: ['WhatsApp', 'Telefoon', 'Email'],
      },
      en: {
        title: 'Get in touch',
        items: ['WhatsApp', 'Phone', 'Email'],
      },
    },
  };

  const data = content[type][language as 'nl' | 'en'];

  return (
    <div 
      className="px-4 py-6"
      style={{
        animation: 'fade-in 0.4s ease-out',
        minHeight: '26vh',
      }}
    >
      <div
        className="rounded-3xl p-6"
        style={{
          background: 'rgba(255, 255, 255, 0.10)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
        }}
      >
        <h3
          className="text-white text-xl font-semibold mb-4"
          style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
        >
          {data.title}
        </h3>
        
        <ul className="space-y-2">
          {data.items.map((item, index) => (
            <li
              key={index}
              className="text-white/85"
              style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
            >
              • {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
