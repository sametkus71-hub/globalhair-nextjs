import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedAdminRoute>
            <AdminLayout>
                {children}
            </AdminLayout>
        </ProtectedAdminRoute>
    );
}
