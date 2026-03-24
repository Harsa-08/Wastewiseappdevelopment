import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { authStorage } from '../services/storage';
import BottomNav from './BottomNav';
import TopBar from './TopBar';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = authStorage.getCurrentUser();
    if (!user) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  // Check if current page should hide bottom nav
  const hideBottomNav = ['/login'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
      <main className="flex-1 pb-20 pt-16">
        <Outlet />
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
