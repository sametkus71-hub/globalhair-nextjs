import { useEffect, useMemo, useRef, useState } from "react";

const BASE = [
  { 
    id: "standard", 
    title: "Standard", 
    bg: "https://globalhair.b-cdn.net/pakketten%20bg%20vid/D%20-%20Standard%20V0.mp4", 
    headline: "FUE Saffier / DHI", 
    description: "Professional hair transplant using proven FUE Sapphire and DHI techniques for natural results.",
    link: "#",
    type: "video"
  },
  { 
    id: "premium", 
    title: "Premium", 
    bg: "/lovable-uploads/4f77654b-737b-493a-a695-ad8360dbeb0d.png", 
    headline: "GHI Stemcell Repair™", 
    description: "Enhanced treatment with stem cell technology for superior hair growth and recovery.",
    link: "#",
    type: "image"
  },
  { 
    id: "advanced", 
    title: "Advanced", 
    bg: "/lovable-uploads/49617091-42a9-4433-bd8b-df560cd352ac.png", 
    headline: "GHI Stemcell + Prime", 
    description: "Our most comprehensive hair restoration treatment combining advanced techniques with premium care.",
    link: "#",
    type: "image"
  },
];

export const TreatmentsCarousel = () => {
  const items = useMemo(() => {
    // Order: Standard, Premium (middle/default), Advanced
    return [BASE[0], BASE[1], BASE[2]];
  }, []);

  const clones = useMemo(() => {
    const first = items[0], last = items[items.length - 1];
    return [last, ...items, first];
  }, [items]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1); // start on the real middle slide (Premium)

  // snap to index helper
  const snapTo = (idx: number, smooth = true) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>(".treat-card")[idx];
    if (!card) return;
    card.scrollIntoView({ behavior: smooth ? "smooth" : "instant", inline: "center", block: "nearest" });
  };

  // initial center
  useEffect(() => { snapTo(1, false); }, []);

  // listen for snap end & handle looping
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let t: number | undefined;
    const onScroll = () => {
      clearTimeout(t);
      t = window.setTimeout(() => {
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
        // loop logic
        if (best === 0) { // at first clone → jump to last real
          setActive(items.length);
          snapTo(items.length, false);
        } else if (best === items.length + 1) { // at last clone → jump to first real
          setActive(1);
          snapTo(1, false);
        } else {
          setActive(best); // 1..items.length
        }
      }, 80);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length, snapTo]);

  // keyboard arrows
  const go = (dir: -1 | 1) => {
    let next = active + dir;
    if (next < 0) next = 0;
    if (next > items.length + 1) next = items.length + 1;
    snapTo(next, true);
  };

  // map active (1..3) → real index for dots (0..2)
  const realIndex = (active <= 0 || active >= items.length + 1)
    ? 1   // safety
    : active - 1;

  return (
    <section className="treatments-tab" aria-label="Treatments">
      <div
        ref={scrollerRef}
        className="treat-scroller"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); }}
      >
        {clones.map((it, i) => (
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
              <h3 className="treat-headline">{it.headline}</h3>
              <p className="treat-description">{it.description}</p>
              <a className="treat-link" href={it.link}>Read more</a>
            </div>
          </article>
        ))}
      </div>

      <div className="treat-dots" role="tablist" aria-label="Pagination">
        {items.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === realIndex}
            className={`dot ${i === realIndex ? "is-active" : ""}`}
            onClick={() => snapTo(i + 1)}
          />
        ))}
      </div>
    </section>
  );
};
