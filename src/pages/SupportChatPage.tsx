import React, { useEffect } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { waitForSalesIQ } from '@/lib/salesiq';
import { SupportCloseBar } from '@/components/SupportCloseBar';

// TypeScript declaration for Zoho SalesIQ
declare global {
  interface Window {
    $zoho?: {
      salesiq?: {
        ready: () => void;
        floatwindow?: {
          visible: (state: "show" | "hide") => void;
        };
        floatbutton?: {
          visible: (state: "show" | "hide") => void;
        };
        chatbutton?: {
          visible: (state: "show" | "hide") => void;
        };
        chatwindow?: {
          visible: (state: "show" | "hide") => void;
          closebutton?: (state: "show" | "hide") => void;
          open?: () => void;
        };
      };
    };
  }
}

const SupportChatPage: React.FC = () => {
  const { language } = useLanguage();

  useEffect(() => {
    let didUnmount = false;

    // open Zoho chat full page
    waitForSalesIQ(() => {
      if (didUnmount) return;
      const siq = (window as any).$zoho.salesiq;
      siq.floatwindow.visible("show");
      siq.chatwindow.visible("show");
      // hide Zoho's own close so users use ours
      if (siq.chatwindow?.closebutton) {
        siq.chatwindow.closebutton("hide");
      }
    });

    // ESC to close (optional)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const siq = (window as any).$zoho?.salesiq;
        siq?.chatwindow?.visible("hide");
        siq?.floatwindow?.visible("hide");
        // Navigate back to support landing page instead of haartransplantatie
        window.location.href = language === 'nl' ? '/nl/support' : '/en/support';
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      didUnmount = true;
      window.removeEventListener("keydown", onKey);
      const siq = (window as any).$zoho?.salesiq;
      if (siq) {
        siq.chatwindow?.visible("hide");
        siq.floatwindow?.visible("hide");
      }
    };
  }, [language]);

  return (
    <>
      <MetaHead
        title={language === "nl" ? "Live Chat Ondersteuning" : "Live Chat Support"}
        description={language === "nl" ? "Chat direct met onze experts" : "Chat directly with our experts"}
        language={language}
      />
      {/* Your page bg, but no z-index tricks here */}
      <div className="min-h-[var(--app-height)]" style={{ background: "#E4E5E0" }}>
        {/* Your content if any… but keep it simple since Zoho overlays the page */}
      </div>

      {/* Always-on-top close bar rendered to <body> */}
      <SupportCloseBar />
    </>
  );
};

export default SupportChatPage;
