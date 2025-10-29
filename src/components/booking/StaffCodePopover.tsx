import { useState } from 'react';
import { Lock, Check } from 'lucide-react';
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
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-20 right-4 z-[60] text-white/60 hover:text-white hover:bg-white/10"
        >
          <Lock className="w-4 h-4 mr-2" />
          Medewerkers
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-background/95 backdrop-blur-xl border-white/20">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-1">Medewerkers code</h4>
            <p className="text-xs text-muted-foreground">Voer de testcode in om testmodus te activeren</p>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isVerifying || isVerified}
              className="flex-1"
            />
            <Button
              onClick={handleVerify}
              disabled={isVerifying || isVerified || !code.trim()}
              size="sm"
            >
              {isVerified ? <Check className="w-4 h-4" /> : 'OK'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
