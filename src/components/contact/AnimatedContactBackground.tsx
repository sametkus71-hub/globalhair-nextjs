import React from 'react';

export const AnimatedContactBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Layer 1: Static gradient background for color tones */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('/lovable-uploads/86cb639c-d2f7-42bd-9923-1441196d2ca2.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Layer 2: Animated gradient blobs */}
      <div className="absolute inset-0 w-full h-full">
        {/* Blob 1 - Top Right */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-60 animate-contact-blob-breathing-1"
          style={{
            background: 'radial-gradient(circle, rgba(172, 209, 198, 0.8) 0%, rgba(172, 209, 198, 0.4) 50%, transparent 100%)',
            filter: 'blur(80px)',
            top: '5%',
            right: '10%',
          }}
        />
        
        {/* Blob 2 - Bottom Left */}
        <div 
          className="absolute w-[450px] h-[450px] rounded-full opacity-50 animate-contact-blob-breathing-2"
          style={{
            background: 'radial-gradient(circle, rgba(255, 182, 193, 0.7) 0%, rgba(255, 182, 193, 0.3) 50%, transparent 100%)',
            filter: 'blur(70px)',
            bottom: '10%',
            left: '5%',
          }}
        />
      </div>

      {/* Layer 3: Static topographic pattern overlay with gradient fade */}
      <div 
        className="absolute inset-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `url('/lovable-uploads/89206142-6b0c-4e53-85bc-304567882660.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
          mask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
          WebkitMask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
        }}
      />
    </div>
  );
};