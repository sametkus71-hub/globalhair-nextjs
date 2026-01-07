'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { PageList } from '@/components/admin/pages/PageList';

export default function PageManagementPage() {
    return (
        <ProtectedAdminRoute>
            <AdminLayout>
                <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Page Management</h1>
                        <p className="text-gray-500">
                            Manage your website's pages, SEO settings, and sitemap configuration.
                        </p>
                    </div>

                    <PageList />
                </div>
            </AdminLayout>
        </ProtectedAdminRoute>
    );
}
