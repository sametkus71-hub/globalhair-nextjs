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
          className="text-white/30 hover:text-white/50 text-xs px-0 h-auto font-normal"
        >
          <Lock className="w-3 h-3 mr-1" />
          Medewerkers
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="space-y-3">
          <div>
            <h4 className="font-normal text-sm mb-1 text-white/80">Medewerkers code</h4>
            <p className="text-xs text-white/50">Voer de testcode in</p>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
              disabled={isVerified}
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
            <Button 
              onClick={handleVerify}
              disabled={isVerifying || isVerified || !code.trim()}
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/10"
            >
              {isVerifying ? (
                <span className="text-xs">...</span>
              ) : isVerified ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-xs">OK</span>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
