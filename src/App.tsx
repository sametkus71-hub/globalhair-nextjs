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
import { CookieConsent } from "@/components/CookieConsent";
import { lazy, Suspense, useEffect } from "react";
import { waitForSalesIQ } from "@/lib/salesiq";
import { usePageVisibility } from "@/hooks/usePageVisibility";

// Lazy load the video background to reduce initial bundle
const PersistentVideoBackground = lazy(() => import("@/components/PersistentVideoBackground").then(m => ({ default: m.PersistentVideoBackground })));

const queryClient = new QueryClient();

function AppBackground() {
  const { pathname } = useLocation();
  const isChat = pathname.endsWith('/chat') || pathname.includes('/chat');
  const isAdminRoute = pathname.startsWith('/admin');
  
  // Don't render background on admin routes
  if (isAdminRoute) return null;
  
  const style = isChat
    ? { background: 'linear-gradient(180deg, #040E15 0%, #333D46 100%)' }
    : { background: '#E4E5E0' };

  return <div className="fixed inset-0" style={style} />;
}

function AppRootInit() {
  // Pause all videos when tab is hidden to save resources
  usePageVisibility();
  
  useEffect(() => {
    // Debug: Detect actual page reloads vs re-renders
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const navType = navEntry?.type || 'unknown';
    const lastMount = sessionStorage.getItem('lastMount');
    const now = Date.now();
    
    console.info('[MetaHead Debug] Navigation type:', navType, '| Last mount:', lastMount ? `${now - parseInt(lastMount)}ms ago` : 'first mount');
    sessionStorage.setItem('lastMount', now.toString());
  }, []);
  
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
                  <CookieConsent />
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