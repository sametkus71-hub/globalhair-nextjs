import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { SessionManager } from "@/components/SessionManager";
import { LanguageWrapper } from "@/components/LanguageWrapper";
import { TransitionProvider } from "@/contexts/TransitionContext";
import { GlobalCentralLogo } from "@/components/GlobalCentralLogo";
import { PageEntryLogo } from "@/components/PageEntryLogo";
import { AnimatedBackground } from "@/components/homepage/AnimatedBackground";
import { SEORoutes } from "@/components/SEORoutes";
import ViewportHeightSetter from "@/components/ViewportHeightSetter";
import { PasswordProtection } from "@/components/PasswordProtection";
import { lazy, Suspense, useEffect } from "react";
import { waitForSalesIQ } from "@/lib/salesiq";

// Lazy load the video background to reduce initial bundle
const PersistentVideoBackground = lazy(() => import("@/components/PersistentVideoBackground").then(m => ({ default: m.PersistentVideoBackground })));

const queryClient = new QueryClient();

function AppBackground() {
  const { pathname } = useLocation();
  const isChat = pathname.endsWith('/chat') || pathname.includes('/chat');
  const style = isChat
    ? { background: 'linear-gradient(180deg, #040E15 0%, #333D46 100%)' }
    : { background: '#E4E5E0' };

  return <div className="fixed inset-0" style={style} />;
}

function AppRootInit() {
  // Zoho SalesIQ integration removed
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionManager>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LanguageWrapper>
              <TransitionProvider>
                <PasswordProtection>
                  <AppRootInit />
                  <ViewportHeightSetter />
                  <AppBackground />
                  <Suspense fallback={null}>
                    <PersistentVideoBackground />
                  </Suspense>
                  
                  <SEORoutes />
                </PasswordProtection>
              </TransitionProvider>
            </LanguageWrapper>
          </BrowserRouter>
        </TooltipProvider>
      </SessionManager>
  </QueryClientProvider>
);

export default App;