interface PackageTierSwitcherProps {
  activePackage: string;
  onPackageChange: (pkg: string) => void;
}

const packages = [
  { id: 'Standard', label: 'Standard', tier: 'standard' },
  { id: 'Premium', label: 'Premium', tier: 'premium' },
  { id: 'Advanced', label: 'Advanced', tier: 'advanced', badge: 'New' },
];

export const PackageTierSwitcher = ({ activePackage, onPackageChange }: PackageTierSwitcherProps) => {
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
        data-active={packages.find(p => p.id === activePackage)?.tier || 'standard'}
      >
        {packages.map((pkg) => {
          const isActive = activePackage === pkg.id;
          
          return (
            <button
              key={pkg.id}
              className={`tier-btn ${isActive ? 'is-active' : ''}`}
              role="tab"
              aria-selected={isActive}
              data-tier={pkg.tier}
              onClick={() => onPackageChange(pkg.id)}
            >
              <span className="label">{pkg.label}</span>
              
              {pkg.badge && (
                <span className="badge-new">{pkg.badge}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
