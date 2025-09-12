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
        {/* Blob 1 */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 animate-contact-blob-1"
          style={{
            background: 'radial-gradient(circle, rgba(172, 209, 198, 0.6) 0%, rgba(172, 209, 198, 0.2) 50%, transparent 100%)',
            filter: 'blur(40px)',
            top: '10%',
            left: '15%',
          }}
        />
        
        {/* Blob 2 */}
        <div 
          className="absolute w-80 h-80 rounded-full opacity-15 animate-contact-blob-2"
          style={{
            background: 'radial-gradient(circle, rgba(73, 44, 58, 0.5) 0%, rgba(73, 44, 58, 0.2) 50%, transparent 100%)',
            filter: 'blur(60px)',
            top: '60%',
            right: '20%',
          }}
        />
        
        {/* Blob 3 */}
        <div 
          className="absolute w-72 h-72 rounded-full opacity-25 animate-contact-blob-3"
          style={{
            background: 'radial-gradient(circle, rgba(172, 209, 198, 0.4) 0%, rgba(172, 209, 198, 0.1) 50%, transparent 100%)',
            filter: 'blur(50px)',
            bottom: '15%',
            left: '25%',
          }}
        />
        
        {/* Blob 4 */}
        <div 
          className="absolute w-64 h-64 rounded-full opacity-20 animate-contact-blob-4"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
            filter: 'blur(45px)',
            top: '40%',
            left: '60%',
          }}
        />
      </div>

      {/* Layer 3: Static topographic pattern overlay */}
      <div 
        className="absolute inset-0 w-full h-full opacity-30"
        style={{
          backgroundImage: `url('/lovable-uploads/89206142-6b0c-4e53-85bc-304567882660.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay'
        }}
      />
    </div>
  );
};