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
import { useEffect } from "react";
import { waitForSalesIQ } from "@/lib/salesiq";

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
  useEffect(() => {
    waitForSalesIQ(() => {
      // overal: verberg standaard alles
      (window as any).$zoho.salesiq.floatbutton.visible("hide");
      (window as any).$zoho.salesiq.chatbutton?.visible("hide");
      (window as any).$zoho.salesiq.floatwindow.visible("hide");
      (window as any).$zoho.salesiq.chatwindow.visible("hide");
    });
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
                  <AppBackground />
                  
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