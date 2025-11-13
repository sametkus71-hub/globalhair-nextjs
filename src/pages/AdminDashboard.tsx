import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminDashboard() {
  const { user } = useAdminAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl text-white mb-4">Admin Dashboard</h1>
      <p className="text-gray-400 mb-8">Welcome, {user?.email}</p>

      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">Dashboard content will be added here</p>
      </div>
    </div>
  );
}
