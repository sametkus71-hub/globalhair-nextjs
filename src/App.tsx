import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SessionManager } from "@/components/SessionManager";
import { LanguageWrapper } from "@/components/LanguageWrapper";
import { TransitionProvider } from "@/contexts/TransitionContext";
import { GlobalCentralLogo } from "@/components/GlobalCentralLogo";
import { PageEntryLogo } from "@/components/PageEntryLogo";
import { AnimatedBackground } from "@/components/homepage/AnimatedBackground";
import { SEORoutes } from "@/components/SEORoutes";
import ViewportHeightSetter from "@/components/ViewportHeightSetter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionManager>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageWrapper>
            <TransitionProvider>
              <ViewportHeightSetter />
              {/* Solid background across all pages */}
              <div className="fixed inset-0" style={{ background: '#E4E5E0' }} />
              
              {/* Global logo - outside background container to avoid fading */}
              <GlobalCentralLogo />
              
              <SEORoutes />
            </TransitionProvider>
          </LanguageWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </SessionManager>
  </QueryClientProvider>
);

export default App;