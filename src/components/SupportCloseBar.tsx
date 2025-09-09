import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { X } from "lucide-react";

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
    <button
      onClick={handleClose}
      style={{
        position: "fixed",
        top: 16, // top-4
        right: 16, // right-4
        width: 40, // w-10
        height: 40, // h-10
        borderRadius: "50%", // rounded-full
        background: "rgba(0, 0, 0, 0.25)", // bg-black/25
        backdropFilter: "blur(12px)", // backdrop-blur-md
        border: "1px solid rgba(255, 255, 255, 0.5)", // border-white/50
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: "all 0.2s ease",
        zIndex: Z_TOP, // Ultra high z-index
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(0, 0, 0, 0.35)"; // hover:bg-black/35
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(0, 0, 0, 0.25)";
      }}
      aria-label={language === 'nl' ? 'Sluiten' : 'Close support'}
    >
      <X style={{ width: 20, height: 20, color: "white" }} />
    </button>,
    document.body
  );
}