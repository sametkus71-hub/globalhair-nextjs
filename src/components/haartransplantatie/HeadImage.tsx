export const HeadImage = () => {
  return (
    <div 
      className="absolute head-glow z-[5]"
      style={{
        top: 'clamp(-1.75rem, 0vh, -0.75rem)',
        right: 'clamp(0.5rem, 1vw, 1.5rem)',
        marginRight: '-120px',
        width: 'clamp(420px, 54vw, 720px)',
        height: '288px',
        animation: 'fade-in-scale 0.8s ease-out 0.3s both',
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-contain"
        style={{
          filter: 'brightness(1.2) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))',
        }}
      >
        <source src="https://GlobalHair.b-cdn.net/Male%201K%20HT%20WEB.mp4" type='video/mp4; codecs="hvc1"' />
        <source src="https://GlobalHair.b-cdn.net/Male%201K%20HT%20WEB.webm" type="video/webm" />
      </video>

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
      `}</style>
    </div>
  );
};
