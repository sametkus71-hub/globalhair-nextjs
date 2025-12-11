import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <MetaHead language={language} page="notfound" />
      <div className="min-h-[var(--app-height)] flex items-center justify-center bg-gray-100">
        <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
          <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
