'use client';

import { usePathname, useSearchParams } from 'next/navigation';
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
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  // Exclude admin routes from password protection
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('app_authenticated');
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
      localStorage.setItem('app_authenticated', 'true');
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

  // Skip password protection for admin routes
  if (isAdminRoute) {
    return <>{children}</>;
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
                  className="w-full h-11 text-center border-black focus-visible:ring-black"
                  autoFocus
                />
                
                {error && (
                  <p className="text-red-600 text-sm text-center">{error}</p>
                )}
                
                <Button
                  type="submit"
                  className="w-full h-11 bg-black text-white hover:bg-black/90 rounded-none"
                >
                  Access Site
                </Button>

                <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                  We're building a new experience. This preview is currently in development and only accessible with a development code. Contact our marketing team to request access.
                </p>
              </form>
            </div>

            {/* Links below container */}
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <a 
                href="https://www.globalhair.nl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline"
              >
                globalhair.nl
              </a>
              <a 
                href="https://www.instagram.com/globalhair.institute/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
