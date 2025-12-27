'use client';

import { useRouter } from 'next/navigation';
import { OZLEM_VIDEO } from '@/data/ozlemVideos';
import { useLanguage } from '@/hooks/useLanguage';

export const OzlemVideoCard = () => {
  const router = useRouter();
  const { language } = useLanguage();

  const handleClick = () => {
    router.push(`/${language}/ozlemdural?sound=on`);
  };

  return (
    <div id="ozlem-card-wrapper" className="w-full lg:w-[350px] h-full flex items-center justify-center mx-auto lg:mx-0 p-4 sm:p-6 lg:pl-1">
      <article
        id="ozlem-card-article"
        className="ozlem-card"
        onClick={handleClick}
      >
        {/* Video background */}
        <video
          id="ozlem-video-bg"
          src={OZLEM_VIDEO.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="ozlem-card-bg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        />

        {/* Gradient overlay */}
        <div className="ozlem-card-overlay" />

        {/* Content on top */}
        <div id="ozlem-content-container" className="ozlem-card-content">
          {/* Top left - Name badge */}
          <div className="absolute top-4 left-4">
            <div className="ozlem-badge">
              <span className="ozlem-badge-text">
                <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 500, opacity: 0.85 }}>Ö</span>zlem Dural
              </span>
            </div>
          </div>

          {/* Top right - Mute icon */}
          <div className="absolute top-4 right-4">
            <svg
              className="w-6 h-6 text-white/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
          </div>

          {/* Bottom left - List with bold header */}
          <div id="ozlem-details" className="absolute bottom-4 left-4 flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-white/95 tracking-wide">CPO - GlobalHair Institute</p>
            <div className="flex flex-col gap-0.5 pl-0.5">
              <p className="text-[11px] font-light text-white/80 tracking-wide">• 15 years in the hair industry</p>
            </div>
          </div>
        </div>
      </article>
      <style>{`
        .ozlem-card {
          position: relative;
          width: 100%;
          max-width: 24rem;
          height: 100%;
          border-radius: 1rem;
          overflow: hidden;
          cursor: pointer;
          backdrop-filter: blur(10px);
          background: rgba(0,0,0,.15);
        }

        @media (min-width: 640px) {
          .ozlem-card {
            max-width: 26rem;
          }
        }

        @media (min-width: 1024px) {
          .ozlem-card {
            max-width: 28rem;
          }
        }

        .ozlem-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          padding: 1.8px;
          background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 3;
        }

        .ozlem-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 70%, transparent 100%);
          pointer-events: none;
          z-index: 1;
        }

        .ozlem-card-content {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .ozlem-badge {
          position: relative;
          padding: 0.65rem 1rem;
          border-radius: 9999px;
          background: linear-gradient(90deg, #132536 0%, #25496B 50%, #132536 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ozlem-badge::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          padding: 1.5px;
          background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .ozlem-badge-text {
          font-family: Inter, Arial, system-ui, sans-serif;
          font-weight: 400;
          font-size: 12px;
          line-height: 1;
          margin-top: -1px;
          background: linear-gradient(119.16deg, #B8B8B8 -0.57%, #FFFFFF 60.78%, #B8B8B8 122.13%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
          z-index: 1;
        }

        .ozlem-badge-text > span {
          background: inherit;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

      `}</style>
    </div>
  );
};
