'use client';

import { RechargeLayout } from '@/components/recharge/RechargeLayout';
import { RechargeContent } from '@/components/recharge/RechargeContent';
import { usePathname } from 'next/navigation';

export default function MethodsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const activeMethod = pathname?.includes('/rescue')
    ? 'rescue'
    : pathname?.includes('/reborn')
    ? 'reborn'
    : 'recharge';

  return (
    <RechargeLayout>
      <RechargeContent method={activeMethod as any} />
      {/* 
          We keep children here in case we want to render page-specific 
          overlays later, but the main content is now persistent in the layout.
      */}
      <div className="hidden">{children}</div>
    </RechargeLayout>
  );
}
