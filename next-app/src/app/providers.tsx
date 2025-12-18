'use client';

import { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TransitionProvider } from '@/contexts/TransitionContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ViewportHeightSetter } from '@/components/ViewportHeightSetter';
import { BookingModalProvider } from '@/contexts/BookingModalContext';

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
        <BookingModalProvider>
          <TransitionProvider>
            <ViewportHeightSetter />
            {children}
          </TransitionProvider>
        </BookingModalProvider>
      </QueryClientProvider>
    </TooltipProvider>
  );
}