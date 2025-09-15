import React from 'react';
import WhatsAppLogo from '@/assets/whatsapp-logo.svg';

interface CustomWhatsAppIconProps {
  className?: string;
}

export const CustomWhatsAppIcon: React.FC<CustomWhatsAppIconProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={WhatsAppLogo}
        alt="WhatsApp" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};