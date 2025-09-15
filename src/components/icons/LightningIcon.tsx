import { cn } from '@/lib/utils';

interface LightningIconProps {
  className?: string;
}

export const LightningIcon = ({ className }: LightningIconProps) => {
  return (
    <svg width="17" height="25" viewBox="0 0 28 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g filter="url(#filter0_d_36_1230)">
        <path d="M23.115 18.2681H14.0106L16.1555 4L4.10608 23.569H13.2105L11.0655 37.8383L23.115 18.2681Z" fill="white"/>
      </g>
      <defs>
        <filter id="filter0_d_36_1230" x="0.106079" y="0" width="27.0089" height="41.8383" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_36_1230"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_36_1230" result="shape"/>
        </filter>
      </defs>
    </svg>
  );
};