import { Home, MapPin, Calendar, ShoppingBag, Trophy } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MapPin, label: 'Map', path: '/map' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: ShoppingBag, label: 'Market', path: '/marketplace' },
    { icon: Trophy, label: 'Rewards', path: '/rewards' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-50">
      <div className="h-full max-w-7xl mx-auto px-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
