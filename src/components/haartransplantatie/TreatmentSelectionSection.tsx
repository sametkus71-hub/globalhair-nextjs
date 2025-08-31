import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { MessageCircle, Headphones, BookOpen } from 'lucide-react';
import { calculatePrice, formatPrice } from '@/lib/pricing';

export const TreatmentSelectionSection = () => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useSession();
  const [selectedPackage, setSelectedPackage] = useState('Standard');
  
  const totalPrice = calculatePrice(profile);

  const packages = [
    { 
      id: 'Standard', 
      label: 'Standard',
      isNew: false
    },
    { 
      id: 'Plus', 
      label: 'Plus',
      isNew: false
    },
    { 
      id: 'Premium', 
      label: 'Premium',
      isNew: true
    },
    { 
      id: 'Advanced', 
      label: 'Advanced',
      isNew: true
    }
  ];

  const features = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing",
    "Lorem ipsum dolor sit amet,",
    "Lorem ipsum dolor sit am",
    "Lorem ipsum dolor sit amet, con"
  ];

  return (
    <div className="w-full h-full relative bg-[#E4E5E0] flex flex-col">
      {/* Main Content - now naturally positioned after the grid */}
      <div className="flex-1 flex flex-col justify-start px-6 pt-20 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-lato text-[33px] font-normal text-black mb-3" style={{ lineHeight: '0.97' }}>
            Time to start over
          </h1>
          <p className="font-lato text-[14px] font-normal text-gray-700" style={{ lineHeight: '0.97' }}>
            Ontdek de kracht van haartransplantatie
          </p>
        </div>

        {/* Country Selection */}
        <div className="flex justify-center mb-6">
          <div 
            className="rounded-full p-0.5"
            style={{
              boxShadow: '-2px 6px 6.3px 0px rgba(0, 0, 0, 0.25) inset',
              border: '1px solid',
              borderImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0.27) 0%, rgba(255, 255, 255, 0.35) 100%)',
              borderImageSlice: 1,
            }}
          >
            <div className="flex">
              {['Nederland', 'Turkije'].map((country) => (
                <button
                  key={country}
                  onClick={() => updateProfile('locatie', country)}
                  className={`px-4 py-1 rounded-full font-lato text-[12px] font-normal transition-all duration-200 ${
                    profile.locatie === country
                      ? 'text-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                  style={profile.locatie === country ? {
                    boxShadow: '5px 0px 12px 0px rgba(151, 151, 151, 1)',
                    backdropFilter: 'blur(52.3px)',
                    background: 'rgba(255, 255, 255, 0.9)'
                  } : {}}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="flex justify-center mb-8">
          <div 
            className="rounded-full p-0.5"
            style={{
              boxShadow: '-2px 6px 6.3px 0px rgba(0, 0, 0, 0.25) inset',
              border: '1px solid',
              borderImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0.27) 0%, rgba(255, 255, 255, 0.35) 100%)',
              borderImageSlice: 1,
            }}
          >
            <div className="flex">
              {packages.map((pkg) => (
                <div key={pkg.id} className="relative">
                  {pkg.isNew && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Nieuw
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`px-4 py-1 font-lato text-[12px] font-normal transition-all duration-200 first:rounded-l-full last:rounded-r-full ${
                      selectedPackage === pkg.id
                        ? 'text-black'
                        : 'text-gray-600 hover:text-black'
                    }`}
                    style={selectedPackage === pkg.id ? {
                      boxShadow: '5px 0px 12px 0px rgba(151, 151, 151, 1)',
                      backdropFilter: 'blur(52.3px)',
                      background: 'rgba(255, 255, 255, 0.9)'
                    } : {}}
                  >
                    {pkg.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="max-w-md mx-auto mb-6">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 mr-3 flex-shrink-0" />
                <span className="font-lato text-[14px] font-normal leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cost Display */}
        <div className="text-center">
          <p className="font-lato text-[14px] font-normal text-gray-700">
            Geschatte kosten: {formatPrice(totalPrice)}
          </p>
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-6">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white/80" />
        </div>
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <Headphones className="w-6 h-6 text-white/80" />
        </div>
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white/80" />
        </div>
      </div>
    </div>
  );
};