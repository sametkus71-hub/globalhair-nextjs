export const HeadImage = () => {
  return (
    <div 
      className="absolute head-glow z-[5]"
      style={{
        top: 'clamp(2rem, 3vh, 3rem)',
        right: 'clamp(0.5rem, 1vw, 1.5rem)',
        marginRight: '-75px',
        width: 'clamp(350px, 45vw, 600px)',
        height: '240px',
        animation: 'fade-in-scale 0.8s ease-out 0.3s both',
      }}
    >
      <img
        src="/assets/placeholder-head.png"
        alt="3D head model"
        className="w-full h-full object-contain"
        style={{
          filter: 'brightness(1.2) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))',
        }}
      />

      <style>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .head-glow::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70%;
          height: 70%;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          filter: blur(40px);
          opacity: 1;
          z-index: -1;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};
