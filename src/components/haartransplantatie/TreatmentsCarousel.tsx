import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSession } from "@/hooks/useSession";

const FEATURES = [
  "FUE Saffier / DHI",
  "GHI Stemcell Repair™️",
  "Full Comfort Anesthesia",
  "V6 Hairboost ®️ - Prime",
  "V6 Hairboost ®️ - Recovery"
];

const PACKAGE_VISIBILITY = {
  standard: [0], // Only first item visible
  premium: [0, 1, 3], // Items 1, 2, and 4 visible
  advanced: [0, 1, 2, 3, 4] // All items visible
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
    id: "advanced", 
    title: "Advanced", 
    bg: "https://globalhair.b-cdn.net/pakketten%20bg%20vid/D%20-%20Elite%20V0.mp4", 
    type: "video"
  },
];

export const TreatmentsCarousel = () => {
  const { language } = useLanguage();
  const { profile } = useSession();

  // Generate package detail link based on language and location
  const getPackageLink = (packageId: string) => {
    const country = profile.locatie.toLowerCase(); // 'nederland' or 'turkije'
    const tier = packageId.toLowerCase(); // 'standard', 'premium', or 'advanced'
    
    if (language === 'en') {
      return `/en/hair-transplant/${country}/${tier}`;
    }
    return `/nl/haartransplantatie/${country}/${tier}`;
  };

  const items = useMemo(() => {
    // Order: Standard, Premium (middle/default), Advanced
    return BASE.map(pkg => ({
      ...pkg,
      link: getPackageLink(pkg.id)
    }));
  }, [language, profile.locatie]);

  const clones = useMemo(() => {
    const first = items[0], last = items[items.length - 1];
    return [last, ...items, first];
  }, [items]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const isSnappingRef = useRef(false);
  const isUserScrollingRef = useRef(false);
  const targetRealIndexRef = useRef<number | null>(null);
  const prevRealIndexRef = useRef<number | null>(null);
  const [active, setActive] = useState(2); // start on the real middle slide (Premium)
  const [dotTransitioning, setDotTransitioning] = useState(false);
  const [pendingDot, setPendingDot] = useState<number | null>(null);

  // Helper functions for 3D animation
  const clamp = (n: number, min = -1, max = 1) => {
    return Math.max(min, Math.min(max, n));
  };

  const update3DTransforms = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".treat-card"));
    if (!cards.length) return;

    const scrollerRect = el.getBoundingClientRect();
    const midX = scrollerRect.left + scrollerRect.width / 2;

    // Card width used to normalize distance
    const cardW = cards[0].getBoundingClientRect().width || 1;

    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;

      // progress: -1 (far left) → 0 (center) → +1 (far right)
      const progress = clamp((cardCenter - midX) / cardW);

      // Scale from 0.92 at edges to 1.0 at center
      const scale = 0.92 + (1 - Math.min(1, Math.abs(progress))) * 0.08;

      // Subtle blur for non-focused cards (0px at center, up to 0.8px at edges)
      const blur = (1 - (scale - 0.92) / 0.08) * 0.8;

      // Slight Y-rotation for depth (negative to the left, positive to the right)
      const rotateY = -12 * progress; // degrees

      // Small Z-translation to enhance depth
      const translateZ = (scale - 0.92) * 120; // pixels in 3D space

      card.style.transform = `translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.filter = `blur(${blur}px)`;

      // Make the focused card visually on top
      card.style.zIndex = String(Math.round(scale * 100));
      card.style.opacity = String(0.8 + (scale - 0.92) * 2.5); // fade non-focused cards
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

  // initial center
  useEffect(() => { 
    snapTo(2, false);
    update3DTransforms();
  }, []);

  // Consolidated scroll listener: 3D transforms + snap detection
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

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

      // Detect snap end and handle looping
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
        
        // Only proceed if we've actually moved to a different card
        if (best === active && !dotTransitioning) {
          return;
        }
        
        // loop logic: jump to real slide without updating active prematurely
        if (best === 0) { // at first clone → jump to last real
          snapTo(items.length, false);
          setTimeout(() => el.classList.remove("is-scrolling"), 100);
          return;
        } else if (best === items.length + 1) { // at last clone → jump to first real
          snapTo(1, false);
          setTimeout(() => el.classList.remove("is-scrolling"), 100);
          return;
        } else {
          // Only update active for real slides (1..items.length)
          setActive(best);
          
          // Clear pending state when we've reached the target
          const reachedReal = best - 1; // 0..items.length-1
          if (dotTransitioning && targetRealIndexRef.current === reachedReal) {
            setPendingDot(null);
            setDotTransitioning(false);
            targetRealIndexRef.current = null;
            prevRealIndexRef.current = null;
          }
        }
        // Update transforms after snap detection
        requestAnimationFrame(update3DTransforms);
      }, 150);
    };

    // run once on mount and on resize
    update3DTransforms();
    const ro = new ResizeObserver(() => update3DTransforms());

    el.addEventListener("scroll", onScroll, { passive: true });
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(snapTimeout);
    };
  }, [items.length, dotTransitioning]);

  // keyboard arrows and dot navigation
  const go = (dir: -1 | 1) => {
    // Prevent multiple rapid calls
    if (isSnappingRef.current) return;
    
    let next = active + dir;
    if (next < 0) next = 0;
    if (next > items.length + 1) next = items.length + 1;
    snapTo(next, true);
  };

  // map active (1..3) → real index for dots (0..2)
  const realIndex = (active <= 0 || active >= items.length + 1)
    ? 1   // safety
    : active - 1;

  // Reorder dots so active is always in center
  // Reorder dots so active is always in center
  const getDisplayDots = () => {
    const totalDots = items.length;
    const centerIndex = Math.floor(totalDots / 2);

    // During a dot transition, freeze the active dot to the previous real index
    const effectiveRealIndex = (dotTransitioning && prevRealIndexRef.current !== null)
      ? prevRealIndexRef.current!
      : realIndex;

    const offset = centerIndex - effectiveRealIndex;
    
    return items.map((_, i) => {
      let displayIndex = (i + offset + totalDots) % totalDots;
      return {
        originalIndex: i,
        displayIndex,
        isActive: dotTransitioning 
          ? (i === prevRealIndexRef.current)
          : (i === realIndex),
        isPending: pendingDot !== null && i === pendingDot
      };
    }).sort((a, b) => a.displayIndex - b.displayIndex);
  };

  const handleDotClick = (displayIndex: number) => {
    const centerIndex = Math.floor(items.length / 2);
    
    // Center dot - do nothing (already active)
    if (displayIndex === centerIndex) return;
    
    // Determine direction: left dot = -1, right dot = +1
    const direction = displayIndex < centerIndex ? -1 : 1;
    
    // Calculate the exact target real index (0..items.length-1)
    const target = (realIndex + direction + items.length) % items.length;
    targetRealIndexRef.current = target;
    
    // Freeze current active dot during transition
    prevRealIndexRef.current = realIndex;
    
    // Show pending state for the target dot
    setPendingDot(target);
    setDotTransitioning(true);
    
    // Navigate one card in the appropriate direction
    go(direction);
  };

  return (
    <section className="treatments-tab" aria-label="Treatments">
      <div
        ref={scrollerRef}
        className="treat-scroller"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); }}
      >
        {clones.map((it, i) => {
          return (
          <article
            key={`${it.id}-${i}`}
            className="treat-card"
          >
            {it.type === "video" ? (
              <video
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
                {FEATURES.map((feature, idx) => {
                  const visibleIndices = PACKAGE_VISIBILITY[it.id as keyof typeof PACKAGE_VISIBILITY];
                  const isVisible = visibleIndices.includes(idx);
                  return (
                    <li 
                      key={idx} 
                      className={`treat-feature-item ${!isVisible ? 'treat-feature-faded' : ''}`}
                    >
                      {feature}
                    </li>
                  );
                })}
              </ul>
              <a className="treat-link" href={it.link}>Read more</a>
            </div>
          </article>
          );
        })}
      </div>

      <div className="treat-dots" role="tablist" aria-label="Pagination">
        {getDisplayDots().map((dot) => (
          <button
            key={dot.originalIndex}
            role="tab"
            aria-selected={dot.isActive}
            className={`dot ${dot.isActive ? "is-active" : ""} ${dot.isPending ? "is-pending" : ""} ${dotTransitioning ? "is-transitioning" : ""}`}
            onClick={() => handleDotClick(dot.displayIndex)}
          />
        ))}
      </div>
    </section>
  );
};
