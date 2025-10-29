import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StaffCodePopoverProps {
  onCodeVerified: () => void;
}

export const StaffCodePopover = ({ onCodeVerified }: StaffCodePopoverProps) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [open, setOpen] = useState(false);

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
        sessionStorage.setItem('staffTestMode', 'true');
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="text-xs text-white/30 hover:text-white/50">
          Medewerkers
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 bg-white border border-gray-300 shadow-xl rounded-sm p-5">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Medewerkers toegang</h3>
            <p className="text-xs text-gray-500">Voer de medewerkers code in om test modus te activeren</p>
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Code invoeren"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isVerified}
              className="text-sm border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 rounded-sm"
              autoFocus
            />
            <Button 
              onClick={handleVerify}
              disabled={isVerifying || isVerified || !code.trim()}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm h-9 rounded-sm"
            >
              {isVerifying ? 'Verifiëren...' : isVerified ? 'Geverifieerd ✓' : 'Verifiëren'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
