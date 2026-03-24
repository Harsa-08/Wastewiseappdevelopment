import { Bell, Menu, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { authStorage } from '../services/storage';
import { User } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { mockNotifications } from '../services/mockData';
import { useNavigate } from 'react-router';

export default function TopBar() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authStorage.getCurrentUser();
    setUser(currentUser);
    
    // Count unread notifications
    const unread = mockNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground">♻️</span>
          </div>
          <div>
            <h1 className="text-lg leading-tight text-primary">WasteWise</h1>
            <p className="text-xs text-muted-foreground leading-tight">Clean City Initiative</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border ${
                      notif.read ? 'bg-muted/50' : 'bg-accent'
                    }`}
                  >
                    <h4 className="text-sm">{notif.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/leaderboard')}>
                Leaderboard
              </DropdownMenuItem>
              {user?.isAdmin && (
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  authStorage.logout();
                  navigate('/login');
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}