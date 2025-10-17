import { useEffect, useRef } from 'react';

interface PackagePanelSliderProps {
  activePackage: string;
}

const packageData = {
  Standard: {
    title: 'FUE Saffier',
    subtitle: null,
    features: ['arrow', 'leaf'],
    lines: ['FUE Saffier'],
    url: '#packages-standard'
  },
  Premium: {
    title: 'FUE Saffier / DHI',
    subtitle: 'V6 Hairboost®',
    features: ['arrow', 'arrow', 'leaf', 'leaf'],
    lines: ['FUE Saffier / DHI', 'V6 Hairboost®'],
    url: '#packages-premium'
  },
  Advanced: {
    title: 'FUE Saffier / DHI',
    subtitle: 'V6 Hairboost® + GHI Stemcell repair™',
    features: ['arrow', 'arrow', 'leaf', 'leaf', 'leaf'],
    lines: ['FUE Saffier / DHI', 'V6 Hairboost®', 'GHI Stemcell repair™'],
    url: '#packages-advanced'
  }
};

export const PackagePanelSlider = ({ activePackage }: PackagePanelSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  
  const getIndex = (pkg: string) => {
    const map: Record<string, number> = { Standard: 0, Premium: 1, Advanced: 2 };
    return map[pkg] || 0;
  };

  const currentIndex = getIndex(activePackage);
  const currentData = packageData[activePackage as keyof typeof packageData] || packageData.Standard;

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  return (
    <section className="packages-module">
      <div className="pkg-panel">
        <div className="pkg-track" ref={trackRef} data-index={currentIndex}>
          {/* Pane 1: Standard */}
          <article 
            className={`pkg-pane ${activePackage === 'Standard' ? 'is-current' : ''}`}
            data-url="#packages-standard" 
            aria-labelledby="pkg-standard-title"
          >
            <header className="pkg-header">
              <h3 id="pkg-standard-title" className="pkg-title">FUE Saffier</h3>
            </header>

            <div className="pkg-features">
              <span className="chip"><i className="ico ico-arrow"></i></span>
              <span className="chip"><i className="ico ico-leaf"></i></span>
            </div>

            <ul className="pkg-lines">
              <li>FUE Saffier</li>
            </ul>
          </article>

          {/* Pane 2: Premium */}
          <article 
            className={`pkg-pane ${activePackage === 'Premium' ? 'is-current' : ''}`}
            data-url="#packages-premium" 
            aria-labelledby="pkg-premium-title"
          >
            <header className="pkg-header">
              <h3 id="pkg-premium-title" className="pkg-title">FUE Saffier / DHI</h3>
              <p className="pkg-sub">V6 Hairboost®</p>
            </header>

            <div className="pkg-features">
              <span className="chip"><i className="ico ico-arrow"></i></span>
              <span className="chip"><i className="ico ico-arrow"></i></span>
              <span className="chip"><i className="ico ico-leaf"></i></span>
              <span className="chip"><i className="ico ico-leaf"></i></span>
            </div>

            <ul className="pkg-lines">
              <li>FUE Saffier / DHI</li>
              <li>V6 Hairboost®</li>
            </ul>
          </article>

          {/* Pane 3: Advanced */}
          <article 
            className={`pkg-pane ${activePackage === 'Advanced' ? 'is-current' : ''}`}
            data-url="#packages-advanced" 
            aria-labelledby="pkg-advanced-title"
          >
            <header className="pkg-header">
              <h3 id="pkg-advanced-title" className="pkg-title">FUE Saffier / DHI</h3>
              <p className="pkg-sub">V6 Hairboost® + GHI Stemcell repair™</p>
            </header>

            <div className="pkg-features">
              <span className="chip"><i className="ico ico-arrow"></i></span>
              <span className="chip"><i className="ico ico-arrow"></i></span>
              <span className="chip"><i className="ico ico-leaf"></i></span>
              <span className="chip"><i className="ico ico-leaf"></i></span>
              <span className="chip"><i className="ico ico-leaf"></i></span>
            </div>

            <ul className="pkg-lines">
              <li>FUE Saffier / DHI</li>
              <li>V6 Hairboost®</li>
              <li>GHI Stemcell repair™</li>
            </ul>
          </article>
        </div>

        {/* Bottom bar */}
        <a 
          className="pkg-readmore" 
          href={currentData.url} 
          role="button" 
          aria-label="Read more"
        >
          Read more
        </a>
      </div>
    </section>
  );
};
