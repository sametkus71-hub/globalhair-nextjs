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

        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-sm flex flex-col items-center gap-8">
            {/* Logo outside container */}
            <img 
              src={hairtransplantLogo}
              alt="Hair Transplant Logo"
              className="h-16 w-auto"
            />

            {/* Simple white container */}
            <div className="w-full bg-white p-8 space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Site in Development
                </h1>
                <p className="text-sm text-gray-600">
                  Enter development code to access
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Development code"
                  className="w-full h-11 text-center"
                  autoFocus
                />
                
                {error && (
                  <p className="text-red-600 text-sm text-center">{error}</p>
                )}
                
                <Button
                  type="submit"
                  className="w-full h-11"
                >
                  Access Site
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
