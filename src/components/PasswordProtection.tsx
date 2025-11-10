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
      <div className="fixed inset-0 w-full h-screen overflow-hidden bg-black">
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
          style={{ backgroundColor: 'rgb(12 35 71 / 50%)' }}
        />
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10, 37, 64, 0.6) 0%, rgba(17, 53, 86, 0.4) 25%, rgba(24, 24, 27, 0.2) 40%, transparent 50%)',
          }}
        />
        
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md animate-[fade-in_1s_ease-out]">
            {/* Clean Glass Card */}
            <div 
              className="relative rounded-2xl p-8 md:p-12"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                {/* Logo */}
                <div className="animate-[logo-float_1.5s_ease-out]">
                  <img 
                    src={hairtransplantLogo}
                    alt="Hair Transplant Logo"
                    className="h-16 md:h-20 w-auto"
                    style={{
                      filter: 'drop-shadow(0 4px 12px rgba(255, 255, 255, 0.15))',
                    }}
                  />
                </div>

                {/* Headline */}
                <div className="space-y-3 animate-[text-reveal_1s_ease-out_0.3s_both]">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                    Something Extraordinary
                    <br />
                    Is Coming
                  </h1>
                  <p className="text-base md:text-lg text-white/60 font-light">
                    Enter your access code to continue
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-4 animate-[text-reveal_1s_ease-out_0.5s_both]">
                  <div className="relative">
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Access code"
                      className="w-full h-14 px-6 text-center text-white placeholder-white/30 text-lg font-light tracking-wide border-0 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-0"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      }}
                      autoFocus
                    />
                    {error && (
                      <p className="absolute -bottom-6 left-0 text-red-400/80 text-sm font-light">{error}</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-14 rounded-xl font-medium text-base tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-0"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    Enter
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes logo-float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes text-reveal {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};
