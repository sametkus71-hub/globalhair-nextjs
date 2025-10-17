export const StaticPackagesGlass = () => {
  return (
    <section className="ghi-packages-static" aria-hidden="true">
      <div className="glass-card">
        {/* Tabs (purely visual, not clickable) */}
        <div className="tabs-wrap">
          <div className="tabs-pill" aria-label="Packages">
            <span className="tab is-active">Standard</span>
            <span className="tab-sep"></span>
            <span className="tab">Premium</span>
            <span className="tab-sep"></span>
            <span className="tab">
              Advanced
              <em className="badge-new">New</em>
            </span>
          </div>
        </div>

        {/* Content area */}
        <div className="card-body">
          <div className="col">
            <div className="chips">
              <span className="chip"><i className="ico ico-chevron"></i></span>
              <span className="chip"><i className="ico ico-leaf"></i></span>
            </div>
            <div className="line">FUE Saffier</div>
          </div>

          <div className="v-sep"></div>

          <div className="col">
            <div className="chips">
              <span className="chip"><i className="ico ico-fastchev"></i></span>
              <span className="chip"><i className="ico ico-chevron"></i></span>
              <span className="chip"><i className="ico ico-leaf"></i></span>
              <span className="chip"><i className="ico ico-leaf"></i></span>
            </div>
            <div className="line">FUE Saffier / DHI</div>
            <div className="line muted">V6 Hairboost ®</div>
          </div>

          <div className="v-sep"></div>

          <div className="col">
            <div className="chips">
              <span className="chip"><i className="ico ico-chevron"></i></span>
              <span className="chip"><i className="ico ico-fastchev"></i></span>
              <span className="chip"><i className="ico ico-leaf"></i></span>
              <span className="chip"><i className="ico ico-leaf"></i></span>
              <span className="chip"><i className="ico ico-leaf"></i></span>
            </div>
            <div className="line">FUE Saffier / DHI</div>
            <div className="line muted">V6 Hairboost ®</div>
            <div className="line muted">GHI Stemcell repair ™</div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="readmore-bar">
          <a className="readmore-link" tabIndex={-1}>Read more</a>
        </div>

        {/* Pagination dots */}
        <div className="dots">
          <span className="dot"></span>
          <span className="dot is-active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </section>
  );
};
