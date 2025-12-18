'use client';

import { useState } from 'react';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TransitionProvider } from '@/contexts/TransitionContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ViewportHeightSetter } from '@/components/ViewportHeightSetter';
import { BookingModalProvider } from '@/contexts/BookingModalContext';
import { TestModeProvider } from '@/contexts/TestModeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient in useState to ensure it's only created once on the client
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <TestModeProvider>
          <BookingModalProvider>
            <TransitionProvider>
              <ViewportHeightSetter />
              {children}
            </TransitionProvider>
            <Toaster
              position="top-right"
              duration={4000}
              closeButton
              style={{ zIndex: 99999 }}
              toastOptions={{
                classNames: {
                  toast: 'bg-neutral-950/90 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-xl p-6 flex items-center gap-4',
                  title: 'text-base font-inter font-medium tracking-wide text-white',
                  description: 'text-sm font-inter text-white/60',
                  actionButton: 'bg-white text-black font-medium',
                  cancelButton: 'bg-white/10 text-white',
                  error: '!border-red-500/20 !bg-red-950/30',
                  success: '!border-green-500/20 !bg-green-950/30',
                  warning: '!border-amber-500/20 !bg-amber-950/30',
                  info: '!border-blue-500/20 !bg-blue-950/30',
                },
              }}
            />
          </BookingModalProvider>
        </TestModeProvider>
      </QueryClientProvider>
    </TooltipProvider>
  );
}