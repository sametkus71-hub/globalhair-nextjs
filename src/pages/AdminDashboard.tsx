import { AnimatedLogoGif } from '@/components/logos/AnimatedLogoGif';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <AnimatedLogoGif className="w-12 h-12" />
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl text-white mb-4">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">Welcome, {user?.email}</p>

        <div className="bg-gray-800 p-8 text-center">
          <p className="text-gray-400">Dashboard content will be added here</p>
        </div>
      </div>
    </div>
  );
}
