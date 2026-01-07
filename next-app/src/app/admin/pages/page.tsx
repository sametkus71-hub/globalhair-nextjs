'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { PageStructureLayout } from '@/components/admin/pages/PageStructureLayout';

export default function PageManagementPage() {
    return (
        <ProtectedAdminRoute>
            <AdminLayout>
                <PageStructureLayout />
            </AdminLayout>
        </ProtectedAdminRoute>
    );
}
