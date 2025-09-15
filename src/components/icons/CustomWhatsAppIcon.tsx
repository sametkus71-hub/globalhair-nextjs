import React from 'react';

interface CustomWhatsAppIconProps {
  className?: string;
}

export const CustomWhatsAppIcon: React.FC<CustomWhatsAppIconProps> = ({ className = "" }) => {
  return (
    <svg width="58" height="72" viewBox="0 0 58 72" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g>
        <path d="M29.3033 1C40.838 1.00021 50.1891 10.351 50.1891 21.8857C50.1891 33.4205 40.838 42.7713 29.3033 42.7715C25.9699 42.7715 22.8188 41.9899 20.0231 40.601C19.8851 40.5324 19.7268 40.5161 19.5784 40.5573L8.78113 43.5576C8.23259 43.71 7.78976 43.0988 8.10552 42.6251L12.8728 35.4726C13.0225 35.248 13.0073 34.9526 12.841 34.74C10.0695 31.1957 8.41761 26.7338 8.4176 21.8857C8.4176 10.3509 17.7685 1 29.3033 1Z" fill="url(#whatsapp_gradient)"/>
      </g>
      <rect x="18" y="10" width="20" height="24" rx="2" fill="white"/>
      <rect x="20" y="12" width="16" height="18" rx="1" fill="#25D366"/>
      <defs>
        <linearGradient id="whatsapp_gradient" x1="29.3033" y1="1" x2="29.3033" y2="43.5576" gradientUnits="userSpaceOnUse">
          <stop stopColor="#26D366"/>
          <stop offset="1" stopColor="#26B53D"/>
        </linearGradient>
      </defs>
    </svg>
  );
};