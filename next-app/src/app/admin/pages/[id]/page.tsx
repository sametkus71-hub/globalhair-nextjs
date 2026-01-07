'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { PageEditor } from '@/components/admin/pages/PageEditor';
import { useParams } from 'next/navigation';

export default function PageEditPage() {
    const params = useParams();
    const id = params?.id as string;

    return (
        <ProtectedAdminRoute>
            <AdminLayout>
                <div className="p-6 md:p-8 bg-gray-50 min-h-full">
                    <PageEditor pageId={id} />
                </div>
            </AdminLayout>
        </ProtectedAdminRoute>
    );
}
