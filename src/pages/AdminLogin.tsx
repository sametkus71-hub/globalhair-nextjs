import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import hairtransplantLogo from '@/assets/hairtransplant-logo.png';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Check if user has admin role
        const { data: roleData } = await supabase
          .from('user_roles' as any)
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if ((roleData as any)?.role === 'admin') {
          navigate('/admin');
        } else {
          setError('Toegang geweigerd');
          await supabase.auth.signOut();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Inloggen mislukt');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left container - 30% on desktop, full width on mobile */}
      <div className="w-full lg:w-[30%] p-8 flex flex-col justify-center">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <img 
            src={hairtransplantLogo} 
            alt="GHI Hairtransplant Logo" 
            className="h-20 object-contain"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">E-mailadres</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white focus:border-white"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Wachtwoord</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white focus:border-white"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-gray-900 hover:bg-gray-200"
          >
            {loading ? 'Bezig met inloggen...' : 'Inloggen'}
          </Button>

          {/* Helper Text */}
          <p className="text-gray-400 text-sm text-center mt-6">
            Nog geen account? Neem contact op met de webbeheerder.
          </p>
        </form>
      </div>

      {/* Right side - empty space on desktop */}
      <div className="hidden lg:block flex-1 bg-gray-800" />
    </div>
  );
}
