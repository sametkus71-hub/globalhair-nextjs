import { ReactNode, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="w-full max-w-sm px-6">
          <div className="border border-gray-200 bg-white p-8 space-y-6">
            {/* Minimal header */}
            <div className="space-y-2">
              <h1 className="text-sm font-mono text-gray-900 tracking-tight">
                Development Access
              </h1>
              <p className="text-xs text-gray-500 font-mono leading-relaxed">
                This site is currently in development.<br />
                Access is restricted to development team members only.
              </p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access code"
                  className="w-full text-sm font-mono border-gray-300 focus:border-gray-400 focus:ring-0"
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-red-600 mt-2 font-mono">{error}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-mono h-9"
              >
                Enter
              </Button>
            </form>
            
            {/* Subtle footer */}
            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-mono">v0.1-dev</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
