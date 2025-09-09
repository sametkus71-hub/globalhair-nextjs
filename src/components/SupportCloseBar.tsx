import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { X } from "lucide-react";

const Z_TOP = 2147483647; // Maximum safe 32-bit integer z-index
const BUTTON_ID = "support-close-button-bulletproof";

export function SupportCloseBar() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // push a history state so browser Back closes first
    const state = { __supportOverlay: true };
    window.history.pushState(state, "");
    const onPop = (e: PopStateEvent) => {
      // user pressed Back -> simulate close
      handleClose();
    };
    window.addEventListener("popstate", onPop);

    // Strategy 1: Inject CSS with !important to override any Zoho styles
    const injectBulletproofCSS = () => {
      const existingStyle = document.getElementById('bulletproof-close-button-styles');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'bulletproof-close-button-styles';
        style.textContent = `
          #${BUTTON_ID} {
            z-index: ${Z_TOP} !important;
            position: fixed !important;
            top: 16px !important;
            right: 16px !important;
            pointer-events: auto !important;
            visibility: visible !important;
            display: flex !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
          }
        `;
        document.head.appendChild(style);
      }
    };
    injectBulletproofCSS();

    // Strategy 2: Periodic z-index enforcement (every 500ms)
    const enforceZIndex = () => {
      const button = document.getElementById(BUTTON_ID);
      if (button) {
        button.style.zIndex = Z_TOP.toString();
        button.style.position = 'fixed';
        button.style.visibility = 'visible';
        button.style.pointerEvents = 'auto';
      }
    };
    const enforceInterval = setInterval(enforceZIndex, 500);

    // Strategy 3: DOM Observer to watch for Zoho widget changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if any new elements were added that might affect our button
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // If Zoho adds elements with high z-index, counter them
              if (element.id?.includes('siq') || element.className?.includes('siq') || 
                  element.id?.includes('zoho') || element.className?.includes('zoho')) {
                setTimeout(enforceZIndex, 10); // Small delay to let Zoho finish
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      window.removeEventListener("popstate", onPop);
      clearInterval(enforceInterval);
      observer.disconnect();
      // Clean up injected styles
      const style = document.getElementById('bulletproof-close-button-styles');
      if (style) {
        style.remove();
      }
    };
  }, []);

  function handleClose() {
    // hide Zoho before navigating
    const siq = (window as any).$zoho?.salesiq;
    if (siq) {
      siq.chatwindow?.visible("hide");
      siq.floatwindow?.visible("hide");
    }
    // go back to the correct localized haartransplantatie page
    navigate(`/${language}/haartransplantatie`);
  }

  // Render to body to avoid any stacking context
  return createPortal(
    <button
      id={BUTTON_ID}
      ref={buttonRef}
      onClick={handleClose}
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        width: 44, // Slightly larger for better visibility
        height: 44,
        borderRadius: "50%",
        background: "rgba(0, 0, 0, 0.4)", // Darker for better contrast
        backdropFilter: "blur(12px)",
        border: "2px solid rgba(255, 255, 255, 0.6)", // Stronger border
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: "all 0.2s ease",
        zIndex: Z_TOP,
        // Extra visual reinforcement
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(0, 0, 0, 0.6)";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(0, 0, 0, 0.4)";
        e.currentTarget.style.transform = "scale(1)";
      }}
      aria-label={language === 'nl' ? 'Sluiten' : 'Close support'}
    >
      <X style={{ width: 22, height: 22, color: "white", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />
    </button>,
    document.body
  );
}