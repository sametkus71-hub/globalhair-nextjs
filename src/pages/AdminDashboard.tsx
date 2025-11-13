import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminDashboard() {
  const { user } = useAdminAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Welkom terug! 👋</h1>
        <p className="text-gray-400">Ingelogd als {user?.email}</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
        <h2 className="text-2xl font-semibold text-white mb-4">Admin Dashboard</h2>
        <p className="text-gray-400 text-lg">Meer functionaliteit komt binnenkort beschikbaar</p>
      </div>
    </div>
  );
}
