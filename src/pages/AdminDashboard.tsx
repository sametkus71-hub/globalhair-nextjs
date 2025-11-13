import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function AdminDashboard() {
  const { user } = useAdminAuth();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-900">Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welkom terug! 👋</h1>
        <p className="text-gray-600">Ingelogd als {user?.email}</p>
      </div>

      <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Admin Dashboard</h2>
        <p className="text-gray-600 text-lg">Meer functionaliteit komt binnenkort beschikbaar</p>
      </div>
    </div>
  );
}
