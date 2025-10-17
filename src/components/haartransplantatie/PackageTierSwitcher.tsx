interface PackageTierSwitcherProps {
  activePackage: string;
  onPackageChange: (pkg: string) => void;
}

const packages = [
  { id: 'Standard', label: 'Standard' },
  { id: 'Premium', label: 'Premium' },
  { id: 'Advanced', label: 'Advanced', badge: 'New' },
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
        className="flex items-center rounded-full"
        style={{
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          padding: '6px',
        }}
      >
        {packages.map((pkg, index) => {
          const isActive = activePackage === pkg.id;
          const isFirst = index === 0;
          const isLast = index === packages.length - 1;
          
          return (
            <button
              key={pkg.id}
              onClick={() => onPackageChange(pkg.id)}
              className="relative flex-1 py-3 px-6 transition-all duration-300 flex items-center justify-center"
              style={{
                background: isActive ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                color: isActive ? '#1e3a5f' : 'white',
                fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                fontWeight: isActive ? 600 : 400,
                fontSize: '16px',
                borderRadius: '9999px',
                borderRight: !isLast ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
              }}
            >
              {pkg.label}
              
              {/* New badge */}
              {pkg.badge && (
                <span
                  className="ml-2 text-[11px] px-2.5 py-1 rounded-full inline-block"
                  style={{
                    background: '#fbbf24',
                    color: '#1e3a5f',
                    fontWeight: 700,
                  }}
                >
                  {pkg.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
