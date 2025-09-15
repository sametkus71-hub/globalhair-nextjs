import { cn } from '@/lib/utils';

interface PenIconProps {
  className?: string;
}

export const PenIcon = ({ className }: PenIconProps) => {
  return (
    <svg width="20" height="24" viewBox="0 0 33 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g filter="url(#filter0_d_36_1232)">
        <path d="M28.1651 35.1155L27.5352 35.466L26.4252 33.4646L25.8931 33.7592L23.4941 29.4324L22.3981 30.0394L21.4038 28.2437L20.7891 28.5841L16.7468 24.1582L16.2045 24.4592L4.86749 4H16.155L24.8403 19.674L24.298 19.9749L25.9083 25.7482L25.2937 26.0886L26.2881 27.8843L25.1908 28.4914L27.5885 32.8194L27.0564 33.114L28.1651 35.1155Z" fill="white"/>
      </g>
      <defs>
        <filter id="filter0_d_36_1232" x="0.867493" y="0" width="31.2976" height="39.466" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_36_1232"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_36_1232" result="shape"/>
        </filter>
      </defs>
    </svg>
  );
};