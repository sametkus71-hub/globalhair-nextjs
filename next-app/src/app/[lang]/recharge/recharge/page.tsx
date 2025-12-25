import { RechargeLayout } from '@/components/recharge/RechargeLayout';
import { RechargeContent } from '@/components/recharge/RechargeContent';

// This file is needed because /recharge/recharge is also a valid route in the tabs logic
export default function RechargeSubPage() {
  return (
    <RechargeLayout>
      <RechargeContent />
    </RechargeLayout>
  );
}
