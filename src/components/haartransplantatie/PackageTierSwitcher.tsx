
const packages = [
  { id: 'Standard', label: 'Standard', tier: 'standard' },
  { id: 'Premium', label: 'Premium', tier: 'premium' },
  { id: 'Advanced', label: 'Advanced', tier: 'advanced', badge: 'New' },
];

export const PackageTierSwitcher = () => {
  return (
    <div 
      className="px-4 py-2"
      style={{
        animation: 'fade-in 0.6s ease-out 1s both',
      }}
    >
      <div
        className="tier-switcher"
        role="tablist"
        aria-label="Package tiers"
      >
        {packages.map((pkg) => {
          return (
            <div
              key={pkg.id}
              className="tier-btn"
              role="tab"
              data-tier={pkg.tier}
            >
              <span className="label">{pkg.label}</span>
              
              {pkg.badge && (
                <span className="badge-new">{pkg.badge}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
