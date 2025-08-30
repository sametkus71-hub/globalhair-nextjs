import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SessionManager } from "@/components/SessionManager";
import { LanguageWrapper } from "@/components/LanguageWrapper";
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
            <ViewportHeightSetter />
            {/* Persistent background across all pages */}
            <div className="fixed inset-0" style={{ background: '#111111' }}>
              <AnimatedBackground />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-900/40" />
            </div>
            
            {/* Global logo - outside background container to avoid fading */}
            <GlobalCentralLogo />
            
            {/* Page entry logo for transition effects */}
            <PageEntryLogo />
            
            <SEORoutes />
          </LanguageWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </SessionManager>
  </QueryClientProvider>
);

export default App;