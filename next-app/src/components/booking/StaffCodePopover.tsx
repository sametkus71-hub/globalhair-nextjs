'use client';

import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTestMode } from '@/contexts/TestModeContext';

interface StaffCodePopoverProps {
  onCodeVerified: () => void;
}

export const StaffCodePopover = ({ onCodeVerified }: StaffCodePopoverProps) => {
  const { activateTestMode } = useTestMode();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Strict domain check - only show on specific Vercel deployment
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'globalhair-nextjs-kahc.vercel.app') {
        setIsVisible(true);
      }
    }
  }, []);

  const handleVerify = async () => {
    if (!code.trim()) {
      toast.error('Voer een code in');
      return;
    }

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-staff-code', {
        body: { code: code.trim() }
      });

      if (error) throw error;

      if (data?.valid) {
        setIsVerified(true);
        activateTestMode(); // Update context state and session storage
        toast.success('Test modus geactiveerd');
        onCodeVerified();
        setTimeout(() => setOpen(false), 1000);
      } else {
        toast.error('Ongeldige code');
        setCode('');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error('Verificatie mislukt');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  if (!isVisible && !isVerified) return null;

  return (
    <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="text-xs text-white/30 hover:text-white/50">
            Medewerkers
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 bg-white border border-gray-300 shadow-lg rounded-none p-4">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Medewerkers code invoeren</h3>
              <p className="text-xs text-gray-500">Voer jouw medewerkers code in om staff-mode te activeren</p>
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Code invoeren"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isVerified}
                className="text-sm border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 rounded-none"
                autoFocus
              />
              <Button
                onClick={handleVerify}
                disabled={isVerifying || isVerified || !code.trim()}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm h-9 rounded-none"
              >
                {isVerifying ? 'Verifiëren...' : isVerified ? 'Geverifieerd ✓' : 'Verifiëren'}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
