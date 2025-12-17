import React from 'react';

interface CustomMailIconProps {
  className?: string;
}

export const CustomMailIcon: React.FC<{
  children?: React.ReactNode;
}> = ({
  className = "",
  children
}) => {
  return (
    <svg width="49" height="60" viewBox="0 0 49 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <foreignObject x="-46.3" y="-52.3" width="141.6" height="141.6">
        <div style={{backdropFilter:"blur(26.15px)", clipPath:"url(#bgblur_0_36_1077_clip_path)", height:"100%", width:"100%"}}></div>
      </foreignObject>
      <g filter="url(#filter0_di_36_1077)" data-figma-bg-blur-radius="52.3">
        <rect x="6" width="37" height="37" rx="18.5" fill="#481D2E"/>
        <rect x="6.4" y="0.4" width="36.2" height="36.2" rx="18.1" stroke="url(#paint0_linear_36_1077)" strokeWidth="0.8"/>
        <path d="M33.25 10.625H15.75C14.7848 10.625 14 11.4098 14 12.375V24.625C14 25.5902 14.7848 26.375 15.75 26.375H33.25C34.2152 26.375 35 25.5902 35 24.625V12.375C35 11.4098 34.2152 10.625 33.25 10.625ZM15.75 11.5H33.25C33.3145 11.5 33.3713 11.5235 33.4318 11.5368C31.9167 12.9234 26.893 17.5193 25.1349 19.1033C24.9974 19.2272 24.7756 19.375 24.5 19.375C24.2245 19.375 24.0027 19.2272 23.8647 19.1028C22.1068 17.5191 17.0828 12.923 15.5679 11.5369C15.6286 11.5236 15.6855 11.5 15.75 11.5ZM14.875 24.625V12.375C14.875 12.2893 14.9008 12.2115 14.924 12.1332C16.0836 13.1945 19.5889 16.4013 21.8618 18.4682C19.5963 20.4142 16.09 23.7385 14.9212 24.853C14.9006 24.7786 14.875 24.7059 14.875 24.625ZM33.25 25.5H15.75C15.6801 25.5 15.618 25.4756 15.5527 25.4601C16.7605 24.3087 20.2891 20.9653 22.5148 19.0613C22.7691 19.2921 23.0239 19.5226 23.2789 19.7527C23.6395 20.0783 24.0616 20.25 24.5 20.25C24.9384 20.25 25.3605 20.0782 25.7206 19.7531C25.9758 19.5229 26.2307 19.2923 26.4852 19.0613C28.711 20.9651 32.2391 24.3082 33.4473 25.4601C33.382 25.4756 33.32 25.5 33.25 25.5ZM34.125 24.625C34.125 24.7058 34.0994 24.7786 34.0788 24.853C32.9096 23.7379 29.4037 20.414 27.1382 18.4682C29.4112 16.4013 32.916 13.1948 34.076 12.1331C34.0992 12.2114 34.125 12.2893 34.125 12.375V24.625Z" fill="white"/>
      </g>
      <defs>
        <filter id="filter0_di_36_1077" x="-46.3" y="-52.3" width="141.6" height="141.6" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feMorphology radius="8" operator="erode" in="SourceAlpha" result="effect1_dropShadow_36_1077"/>
          <feOffset dy="17"/>
          <feGaussianBlur stdDeviation="6.8"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.46 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_36_1077"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_36_1077" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect2_innerShadow_36_1077"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.821514 0 0 0 0 0.821514 0 0 0 0 0.821514 0 0 0 0.18 0"/>
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_36_1077"/>
        </filter>
        <clipPath id="bgblur_0_36_1077_clip_path" transform="translate(46.3 52.3)">
          <rect x="6" width="37" height="37" rx="18.5"/>
        </clipPath>
        <linearGradient id="paint0_linear_36_1077" x1="30.1484" y1="37" x2="19.0418" y2="-0.057017" gradientUnits="userSpaceOnUse">
          <stop stopColor="#846772"/>
          <stop offset="0.5" stopColor="#C8BFC3"/>
          <stop offset="1" stopColor="#846772"/>
        </linearGradient>
      </defs>
    </svg>
  );
};