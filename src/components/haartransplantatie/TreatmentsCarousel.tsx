import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "@/hooks/useSession";
import { useIsMobile } from "@/hooks/use-mobile";

// Each package has different features with specific active/blurred states
const PACKAGE_FEATURES = {
  standard: {
    features: [
      "FUE Saffier / DHI",
      "Comfort verdoving",
      "1 year personal follow up",
      "1 year GHI support",
      "GHI Precision Method™"
    ],
    activeIndices: [0] // Only first feature is active
  },
  premium: {
    features: [
      "FUE Saffier / DHI",
      "GHI Stemcell Repair™",
      "Comfort verdoving",
      "V6 Hairboost ® - Prime",
      "V6 Hairboost ® - Recovery"
    ],
    activeIndices: [1, 3] // GHI Stemcell Repair and V6 Hairboost - Prime are active
  },
  elite: {
    features: [
      "FUE Saffier / DHI",
      "GHI Stemcell Repair™",
      "Full Comfort Anesthesia",
      "V6 Hairboost ® - Prime",
      "V6 Hairboost ® - Recovery"
    ],
    activeIndices: [1, 2, 3] // GHI Stemcell Repair, Full Comfort Anesthesia, and V6 Hairboost - Prime are active
  }
};

const BASE = [
  { 
    id: "standard", 
    title: "Standard", 
    bg: "https://globalhair.b-cdn.net/pakketten%20bg%20vid/D%20-%20Standard%20V0.mp4", 
    type: "video"
  },
  { 
    id: "premium", 
    title: "Premium", 
    bg: "https://globalhair.b-cdn.net/pakketten%20bg%20vid/D%20-%20Premium%20V0.mp4", 
    type: "video"
  },
  { 
    id: "elite", 
    title: "Elite",
    bg: "https://globalhair.b-cdn.net/pakketten%20bg%20vid/D%20-%20Elite%20V0.mp4", 
    type: "video"
  },
];

export const TreatmentsCarousel = () => {
  const { language } = useLanguage();
  const { profile } = useSession();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Always generate Dutch package paths for consistency
  const getPackageLink = (packageId: string) => {
    const tier = packageId.toLowerCase(); // 'standard', 'premium', or 'elite'
    return `/nl/haartransplantatie/nl/${tier}`;
  };

  const items = useMemo(() => {
    // Order: Standard, Premium (middle/default), Elite
    return BASE.map(pkg => ({
      ...pkg,
      link: getPackageLink(pkg.id)
    }));
  }, [language, profile.locatie]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isSnappingRef = useRef(false);
  const isUserScrollingRef = useRef(false);
  const [active, setActive] = useState(1); // start on Premium (middle of 3 items)

  // Helper functions for 3D animation
  const clamp = (n: number, min = -1, max = 1) => {
    return Math.max(min, Math.min(max, n));
  };

  const update3DTransforms = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".treat-card"));
    if (!cards.length) return;

    // Only apply 3D transforms on mobile
    if (!isMobile) {
      // Desktop: reset all cards to default state
      cards.forEach((card) => {
        card.style.transform = 'scale(1)';
        card.style.filter = 'none';
        card.style.zIndex = '1';
        card.style.opacity = '1';
      });
      return;
    }

    const scrollerRect = el.getBoundingClientRect();
    const midX = scrollerRect.left + scrollerRect.width / 2;

    // Card width used to normalize distance
    const cardW = cards[0].getBoundingClientRect().width || 1;

    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;

      // progress: -1 (far left) → 0 (center) → +1 (far right)
      const progress = clamp((cardCenter - midX) / cardW);

      // Scale from 0.85 at edges to 1.0 at center
      const scale = 0.85 + (1 - Math.min(1, Math.abs(progress))) * 0.15;

      // Subtle blur for non-focused cards (0px at center, up to 0.8px at edges)
      const blur = (1 - (scale - 0.85) / 0.15) * 0.8;

      // Small Z-translation to enhance depth
      const translateZ = (scale - 0.85) * 120; // pixels in 3D space

      card.style.transform = `translateZ(${translateZ}px) scale(${scale})`;
      card.style.filter = `blur(${blur}px)`;

      // Make the focused card visually on top
      card.style.zIndex = String(Math.round(scale * 100));
      card.style.opacity = String(0.7 + (scale - 0.85) * 2); // fade non-focused cards
    });
  };

  // snap to index helper
  const snapTo = (idx: number, smooth = true) => {
    const el = scrollerRef.current;
    if (!el) return;
    
    // Don't snap if user is actively scrolling
    if (isUserScrollingRef.current && smooth) return;
    
    isSnappingRef.current = true;
    const card = el.querySelectorAll<HTMLElement>(".treat-card")[idx];
    if (!card) return;
    card.scrollIntoView({ behavior: smooth ? "smooth" : "instant", inline: "center", block: "nearest" });
    // re-evaluate transforms and reset flag after a frame
    requestAnimationFrame(() => {
      update3DTransforms();
      setTimeout(() => { isSnappingRef.current = false; }, smooth ? 300 : 100);
    });
  };

  // initial center on Premium (mobile only)
  useEffect(() => {
    if (isMobile) {
      snapTo(1, false);
    }
    update3DTransforms();
  }, [isMobile]);

  // Control video playback based on active state and device
  useEffect(() => {
    if (videoRefs.current.length === 0) return;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      
      if (isMobile) {
        // Mobile: only active video plays
        if (index === active) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      } else {
        // Desktop: all videos play
        video.play().catch(() => {});
      }
    });
  }, [active, isMobile]);

  // Consolidated scroll listener: 3D transforms + snap detection (mobile only)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // run once on mount and on resize
    update3DTransforms();
    const ro = new ResizeObserver(() => update3DTransforms());
    ro.observe(el);

    // Desktop: no scroll behavior needed
    if (!isMobile) {
      return () => {
        ro.disconnect();
      };
    }

    // Mobile: full scroll behavior
    let raf = 0;
    let snapTimeout: number | undefined;

    const onScroll = () => {
      // Mark that user is actively scrolling
      isUserScrollingRef.current = true;
      
      // Add .is-scrolling class to disable CSS transitions during drag
      el.classList.add("is-scrolling");
      
      // Update 3D transforms continuously
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update3DTransforms);

      // Detect snap end
      clearTimeout(snapTimeout);
      snapTimeout = window.setTimeout(() => {
        // Skip if we're in the middle of a programmatic snap
        if (isSnappingRef.current) return;
        
        // Mark that user has stopped scrolling
        isUserScrollingRef.current = false;
        
        // Remove .is-scrolling class to re-enable CSS transitions
        el.classList.remove("is-scrolling");
        
        const cards = Array.from(el.querySelectorAll<HTMLElement>(".treat-card"));
        // find the closest centered card
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0, bestDist = Infinity;
        cards.forEach((c, i) => {
          const rect = c.getBoundingClientRect();
          const center = rect.left + rect.width / 2 + el.scrollLeft - el.getBoundingClientRect().left;
          const d = Math.abs(center - mid);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        
        // Update active if changed
        if (best !== active) {
          setActive(best);
        }
        
        // Update transforms after snap detection
        requestAnimationFrame(update3DTransforms);
      }, 150);
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(snapTimeout);
    };
  }, [active, isMobile]);

  // keyboard arrows navigation
  const go = (dir: -1 | 1) => {
    // Prevent multiple rapid calls
    if (isSnappingRef.current) return;
    
    let next = active + dir;
    // Clamp to valid range [0, 2]
    if (next < 0) next = 0;
    if (next > items.length - 1) next = items.length - 1;
    snapTo(next, true);
  };

  const handleDotClick = (index: number) => {
    if (index === active) return;
    snapTo(index, true);
  };

  const handleCardClick = (index: number) => {
    // On mobile, clicking a non-active card should activate it first
    if (isMobile && index !== active) {
      snapTo(index, true);
      return;
    }
    
    // If card is active (or on desktop), navigate to package detail
    const item = items[index];
    if (typeof document !== 'undefined') document.body.classList.add('popup-open');
    navigate(item.link);
  };

  return (
    <section className="treatments-tab" aria-label="Treatments">
      <div
        ref={scrollerRef}
        className="treat-scroller"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); }}
      >
        {items.map((it, i) => {
          return (
          <article
            key={`${it.id}-${i}`}
            className="treat-card"
            onClick={() => handleCardClick(i)}
            style={{ cursor: 'pointer' }}
          >
            {it.type === "video" ? (
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                autoPlay
                loop
                muted
                playsInline
                className="treat-card-bg"
                style={{ 
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 0
                }}
              >
                <source src={it.bg} type="video/mp4" />
              </video>
            ) : (
              <div className="treat-card-bg" style={{ backgroundImage: `url('${it.bg}')` }} />
            )}
            <div className="treat-card-overlay" />
            <div className="treat-card-content">
              <div className="treat-pill">{it.title}</div>
              <ul className="treat-features-list">
                {PACKAGE_FEATURES[it.id as keyof typeof PACKAGE_FEATURES].features.map((feature, idx) => {
                  const activeIndices = PACKAGE_FEATURES[it.id as keyof typeof PACKAGE_FEATURES].activeIndices;
                  const isActive = activeIndices.includes(idx);
                  return (
                    <li 
                      key={idx} 
                      className={`treat-feature-item ${!isActive ? 'treat-feature-faded' : ''}`}
                    >
                      {feature}
                    </li>
                  );
                })}
              </ul>
              <button 
                className="treat-link" 
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof document !== "undefined") document.body.classList.add("popup-open");
                  navigate(it.link);
                }}
              >
                Read more
              </button>
            </div>
          </article>
          );
        })}
      </div>

      {isMobile && (
        <div className="treat-dots" role="tablist" aria-label="Pagination">
          {items.map((item, index) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={index === active}
              aria-label={`View ${item.title} package`}
              className={`dot ${index === active ? "is-active" : ""}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
