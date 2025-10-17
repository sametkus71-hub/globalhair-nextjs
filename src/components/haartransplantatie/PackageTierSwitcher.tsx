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
      className="px-2 py-2"
      style={{
        animation: 'fade-in 0.6s ease-out 1s both',
      }}
    >
      <div
        className="flex items-center rounded-full p-1"
        style={{
          background: '#1e3a5f',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        {packages.map((pkg, index) => {
          const isActive = activePackage === pkg.id;
          return (
            <button
              key={pkg.id}
              onClick={() => onPackageChange(pkg.id)}
              className="relative flex-1 py-2.5 px-4 transition-all duration-300"
              style={{
                background: isActive ? '#2d5278' : 'transparent',
                color: 'white',
                fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                borderRadius: index === 0 ? '9999px 0 0 9999px' : index === packages.length - 1 ? '0 9999px 9999px 0' : '0',
                borderRight: index < packages.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              }}
            >
              {pkg.label}
              
              {/* New badge */}
              {pkg.badge && (
                <span
                  className="ml-1.5 text-[10px] px-2 py-0.5 rounded-full inline-block align-middle"
                  style={{
                    background: '#fbbf24',
                    color: '#1e3a5f',
                    fontWeight: 700,
                    textTransform: 'uppercase',
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
