import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionManager } from "@/components/SessionManager";
import { LanguageWrapper } from "@/components/LanguageWrapper";
import { GlobalCentralLogo } from "@/components/GlobalCentralLogo";
import { AnimatedBackground } from "@/components/homepage/AnimatedBackground";

// Pages
import HomePage from "./pages/HomePage";
import HaartransplantatiePage from "./pages/HaartransplantatiePage";
import V6HairboostPage from "./pages/V6HairboostPage";
import ComingSoon1Page from "./pages/ComingSoon1Page";
import ComingSoon2Page from "./pages/ComingSoon2Page";
import DashboardPage from "./pages/DashboardPage";
import FormPage from "./pages/FormPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionManager>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageWrapper>
            {/* Persistent background across all pages */}
            <div className="fixed inset-0" style={{ background: '#111111' }}>
              <AnimatedBackground />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-900/40" />
            </div>
            
            {/* Global logo - outside background container to avoid fading */}
            <GlobalCentralLogo />
            
            <Routes>
              {/* Root redirect handled by useLanguage hook */}
              <Route path="/" element={<HomePage />} />
              
              {/* Dutch routes */}
              <Route path="/nl" element={<HomePage />} />
              <Route path="/nl/haartransplantatie" element={<HaartransplantatiePage />} />
              <Route path="/nl/v6-hairboost" element={<V6HairboostPage />} />
              <Route path="/nl/coming-soon-1" element={<ComingSoon1Page />} />
              <Route path="/nl/coming-soon-2" element={<ComingSoon2Page />} />
              <Route path="/nl/dashboard" element={<DashboardPage />} />
              <Route path="/nl/form" element={<FormPage />} />
              
              {/* English routes */}
              <Route path="/en" element={<HomePage />} />
              <Route path="/en/hair-transplant" element={<HaartransplantatiePage />} />
              <Route path="/en/v6-hairboost" element={<V6HairboostPage />} />
              <Route path="/en/coming-soon-1" element={<ComingSoon1Page />} />
              <Route path="/en/coming-soon-2" element={<ComingSoon2Page />} />
              <Route path="/en/dashboard" element={<DashboardPage />} />
              <Route path="/en/form" element={<FormPage />} />
              
              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </SessionManager>
  </QueryClientProvider>
);

export default App;