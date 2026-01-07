import { SiteSettings } from '@/components/admin/pages/SiteSettings';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function SiteSettingsPage() {
    return (
        <AdminLayout>
            <div className="p-8">
                <SiteSettings />
            </div>
        </AdminLayout>
    );
}
