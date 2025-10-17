export const PackagePanelSlider = () => {

  return (
    <section className="packages-module">
      <div className="pkg-panel">
        <div className="pkg-track">
          {/* Pane 1: Standard */}
          <article 
            className="pkg-pane"
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
            className="pkg-pane"
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
            className="pkg-pane"
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
      </div>
    </section>
  );
};
