import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const Z_TOP = 999999999999; // higher than SalesIQ

export function SupportCloseBar() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    // push a history state so browser Back closes first
    const state = { __supportOverlay: true };
    window.history.pushState(state, "");
    const onPop = (e: PopStateEvent) => {
      // user pressed Back -> simulate close
      handleClose();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function handleClose() {
    // hide Zoho before navigating
    const siq = (window as any).$zoho?.salesiq;
    if (siq) {
      siq.chatwindow?.visible("hide");
      siq.floatwindow?.visible("hide");
    }
    // go back to haartransplantatie page
    if (window.history.state?.__supportOverlay) {
      window.history.back();
    } else {
      navigate("/haartransplantatie");
    }
  }

  // Render to body to avoid any stacking context
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",   // let clicks pass through, except our bar
        zIndex: Z_TOP,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          backdropFilter: "saturate(1.2) blur(8px)",
          background: "rgba(255,255,255,0.8)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          pointerEvents: "auto", // clickable
        }}
      >
        <div style={{ fontWeight: 600 }}>
          {language === 'nl' ? 'Ondersteuning' : 'Support'}
        </div>
        <button
          onClick={handleClose}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.1)",
            background: "white",
            cursor: "pointer",
            fontWeight: 500,
          }}
          aria-label={language === 'nl' ? 'Sluiten' : 'Close support'}
        >
          {language === 'nl' ? 'Sluiten' : 'Close'}
        </button>
      </div>
    </div>,
    document.body
  );
}