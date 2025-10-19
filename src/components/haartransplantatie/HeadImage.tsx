export const HeadImage = () => {
  return (
    <div 
      className="absolute head-glow z-0"
      style={{
        top: 'clamp(3.5rem, 5vh, 5rem)',
        right: 'clamp(1rem, 2vw, 2rem)',
        width: 'clamp(600px, 70vw, 1000px)',
        maxHeight: '40vh',
        animation: 'fade-in-scale 0.8s ease-out 0.3s both',
      }}
    >
      <img
        src="/assets/placeholder-head.png"
        alt="3D head model"
        className="w-full h-auto object-contain"
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
