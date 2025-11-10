import { ReactNode, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import hairtransplantLogo from '@/assets/hairtransplant-logo.png';

interface PasswordProtectionProps {
  children: ReactNode;
}

// Build secret string without plain text in code
function getSecret(): string {
  const codes = [87,111,114,108,100,111,102,103,108,111,98,97,108,104,97,105,114,50,48,50,53];
  return String.fromCharCode(...codes);
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export const PasswordProtection = ({ children }: PasswordProtectionProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated in this session
    const authStatus = sessionStorage.getItem('app_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  const input = password.trim();
  if (!input) {
    setError('Password is required');
    return;
  }

  try {
    const [providedHash, expectedHash] = await Promise.all([
      hashPassword(input),
      hashPassword(getSecret()),
    ]);

    if (import.meta.env.DEV) {
      console.info('[PasswordProtection] providedHash:', providedHash);
    }

    if (providedHash === expectedHash) {
      sessionStorage.setItem('app_authenticated', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  } catch {
    setError('An error occurred');
  }
};

  if (isChecking) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 w-full h-screen overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 1.0 }}
        >
          <source src="/assets/background-animation.mp4" type="video/mp4" />
        </video>
        
        {/* Blue-ish transparent overlay */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: 'rgb(12 35 71 / 60%)' }}
        />
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10, 37, 64, 0.7) 0%, rgba(17, 53, 86, 0.5) 25%, rgba(24, 24, 27, 0.3) 50%, transparent 70%)',
          }}
        />

        {/* Spotlight effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(255, 215, 0, 0.08) 0%, transparent 50%)',
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
          <div 
            className="w-full max-w-lg"
            style={{
              animation: 'cinematic-reveal 1.2s ease-out forwards',
            }}
          >
            {/* Logo - Animated */}
            <div 
              className="flex justify-center mb-8"
              style={{
                animation: 'logo-float 1.5s ease-out forwards',
                animationDelay: '0.3s',
                opacity: 0,
              }}
            >
              <img 
                src={hairtransplantLogo} 
                alt="GHI Hairtransplant" 
                className="h-16 drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.3))',
                }}
              />
            </div>

            {/* Glassmorphic Card with Gold Border */}
            <div 
              className="relative p-[2px] rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8), rgba(218, 165, 32, 0.6), rgba(255, 215, 0, 0.8))',
                animation: 'border-glow 3s ease-in-out infinite',
              }}
            >
              {/* Inner Glass Card */}
              <div 
                className="relative rounded-2xl p-10 backdrop-blur-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 60px rgba(255, 215, 0, 0.1)',
                }}
              >
                {/* VIP Access Badge */}
                <div 
                  className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(218, 165, 32, 0.3))',
                    border: '1px solid rgba(255, 215, 0, 0.4)',
                    color: 'rgba(255, 215, 0, 0.95)',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
                    animation: 'pulse-glow 2s ease-in-out infinite',
                    animationDelay: '0.6s',
                  }}
                >
                  VIP ACCESS
                </div>

                {/* Cinematic Headline */}
                <h1 
                  className="text-4xl font-bold mb-3 leading-tight"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFF 50%, #FFD700 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradient-shift 3s ease-in-out infinite, text-reveal 1s ease-out forwards',
                    animationDelay: '0s, 0.8s',
                    opacity: 0,
                  }}
                >
                  Something Extraordinary
                  <br />
                  Is Coming
                </h1>
                
                {/* Subheadline */}
                <p 
                  className="text-base mb-8 leading-relaxed"
                  style={{
                    color: 'rgba(255, 255, 255, 0.75)',
                    animation: 'text-reveal 1s ease-out forwards',
                    animationDelay: '1s',
                    opacity: 0,
                  }}
                >
                  An exclusive preview awaits. Enter your access code to experience the future of premium hair restoration.
                </p>
                
                {/* Form */}
                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                  style={{
                    animation: 'text-reveal 1s ease-out forwards',
                    animationDelay: '1.2s',
                    opacity: 0,
                  }}
                >
                  <div className="relative">
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter VIP Access Code"
                      className="w-full h-14 px-6 text-base backdrop-blur-md border-0 focus-visible:ring-2 focus-visible:ring-offset-0"
                      style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        color: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2), inset 0 0 30px rgba(255, 215, 0, 0.05)',
                        animation: 'input-glow 2s ease-in-out infinite',
                      }}
                      autoFocus
                    />
                    {error && (
                      <p 
                        className="absolute -bottom-6 left-0 text-sm"
                        style={{
                          color: 'rgba(255, 100, 100, 0.9)',
                          textShadow: '0 0 10px rgba(255, 100, 100, 0.5)',
                        }}
                      >
                        {error}
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-base font-semibold tracking-wide transition-all duration-300 border-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(218, 165, 32, 0.9))',
                      color: 'rgb(20, 20, 20)',
                      boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    UNLOCK PREVIEW
                  </Button>
                </form>
                
                {/* Footer Tag */}
                <div 
                  className="text-center mt-8 pt-6 border-t"
                  style={{
                    borderColor: 'rgba(255, 215, 0, 0.2)',
                    animation: 'text-reveal 1s ease-out forwards',
                    animationDelay: '1.4s',
                    opacity: 0,
                  }}
                >
                  <p 
                    className="text-sm font-light tracking-wider"
                    style={{
                      color: 'rgba(255, 215, 0, 0.6)',
                    }}
                  >
                    BY INVITATION ONLY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Animations */}
        <style>{`
          @keyframes cinematic-reveal {
            0% {
              opacity: 0;
              transform: scale(0.95) translateY(30px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes logo-float {
            0% {
              opacity: 0;
              transform: translateY(-30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes text-reveal {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes border-glow {
            0%, 100% {
              opacity: 0.8;
              filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.4));
            }
            50% {
              opacity: 1;
              filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
            }
          }

          @keyframes pulse-glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
            }
            50% {
              box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
            }
          }

          @keyframes input-glow {
            0%, 100% {
              box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2), inset 0 0 30px rgba(255, 215, 0, 0.05);
            }
            50% {
              box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2), inset 0 0 40px rgba(255, 215, 0, 0.1);
            }
          }

          @keyframes gradient-shift {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};
