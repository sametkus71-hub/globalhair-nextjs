import React from 'react';

interface CustomInstagramIconProps {
  className?: string;
}

export const CustomInstagramIcon: React.FC<{
  children?: React.ReactNode;
}> = ({
  className = "",
  children
}) => {
  return (
    <svg width="49" height="60" viewBox="0 0 49 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <foreignObject x="-46.3" y="-52.3" width="141.6" height="141.6">
        <div style={{backdropFilter:"blur(26.15px)", clipPath:"url(#bgblur_0_36_1092_clip_path)", height:"100%", width:"100%"}}></div>
      </foreignObject>
      <g filter="url(#filter0_di_36_1092)" data-figma-bg-blur-radius="52.3">
        <rect x="6" width="37" height="37" rx="18.5" fill="#481D2E"/>
        <rect x="6.4" y="0.4" width="36.2" height="36.2" rx="18.1" stroke="url(#paint0_linear_36_1092)" strokeWidth="0.8"/>
        <rect x="16.4" y="10.4" width="16.2" height="16.2" rx="4.45714" stroke="white" strokeWidth="0.8"/>
        <circle cx="24.7429" cy="18.7426" r="4.45714" stroke="white" strokeWidth="0.8"/>
        <circle cx="29.1142" cy="13.8857" r="0.971429" fill="white"/>
      </g>
      <defs>
        <filter id="filter0_di_36_1092" x="-46.3" y="-52.3" width="141.6" height="141.6" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feMorphology radius="8" operator="erode" in="SourceAlpha" result="effect1_dropShadow_36_1092"/>
          <feOffset dy="17"/>
          <feGaussianBlur stdDeviation="6.8"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.46 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_36_1092"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_36_1092" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect2_innerShadow_36_1092"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.821514 0 0 0 0 0.821514 0 0 0 0 0.821514 0 0 0 0.18 0"/>
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_36_1092"/>
        </filter>
        <clipPath id="bgblur_0_36_1092_clip_path" transform="translate(46.3 52.3)">
          <rect x="6" width="37" height="37" rx="18.5"/>
        </clipPath>
        <linearGradient id="paint0_linear_36_1092" x1="30.1484" y1="37" x2="19.0418" y2="-0.057017" gradientUnits="userSpaceOnUse">
          <stop stopColor="#846772"/>
          <stop offset="0.5" stopColor="#C8BFC3"/>
          <stop offset="1" stopColor="#846772"/>
        </linearGradient>
      </defs>
    </svg>
  );
};