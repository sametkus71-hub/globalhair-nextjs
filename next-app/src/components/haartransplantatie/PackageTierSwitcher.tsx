'use client';

interface PackageTierSwitcherProps {
  activePackage: string;
  onPackageChange: (pkg: string) => void;
}

const packages = [
  { id: 'Standard', label: 'Standard' },
  { id: 'Premium', label: 'Premium' },
  { id: 'Elite', label: 'Elite', badge: 'New' },
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
        className="flex items-center rounded-full p-0.5"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.20)',
        }}
      >
        {packages.map((pkg) => {
          const isActive = activePackage === pkg.id;
          return (
            <button
              key={pkg.id}
              onClick={() => onPackageChange(pkg.id)}
              className="relative flex-1 py-2 px-3 rounded-full transition-all duration-300"
              style={{
                background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                boxShadow: isActive ? '0 4px 15px rgba(0, 0, 0, 0.3)' : 'none',
                color: 'white',
                fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                fontWeight: isActive ? 600 : 400,
                fontSize: '13px',
              }}
            >
              {pkg.label}
              
              {/* New badge */}
              {pkg.badge && (
                <span
                  className="absolute -top-1 -right-1 text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: 'white',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
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
