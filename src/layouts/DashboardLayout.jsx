import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map as MapIcon, Grid, Bell, 
  Menu, X, User, LogOut, ChevronRight, FileText
} from 'lucide-react';
import AssistantButton from '../components/assistant/AssistantButton';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getUserById } from '../utils/userLand';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('demo_user_id');
    if (!userId) {
      navigate('/login');
    } else {
      const u = getUserById(userId);
      if (!u) {
        localStorage.removeItem('demo_user_id');
        navigate('/login');
      } else {
        setUser(u);
      }
    }
  }, [navigate]);

  if (!user) return null; // Avoid flashing layout before redirect

  const handleLogout = () => {
    localStorage.removeItem('demo_user_id');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Land', path: '/dashboard/my-land', icon: MapIcon },
    { label: 'Applications', path: '/dashboard/applications', icon: FileText },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { label: 'Map Search', path: '/map', icon: Grid } // Public route integration
  ];

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:flex md:flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-white">
          <Link to="/dashboard" className="text-xl font-bold text-primary-700">BhuSetu</Link>
          <button className="md:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path) && item.path !== '/map');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  isActive 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 mr-3 flex-shrink-0",
                  isActive ? "text-primary-700" : "text-gray-400 group-hover:text-gray-500"
                )} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white h-16 flex items-center justify-between px-4 border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="flex items-center">
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 mr-4" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-lg font-bold text-gray-900">BhuSetu</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
            {user.name.charAt(0)}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          <Outlet context={{ user }} />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 px-2 py-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.filter(i => i.path !== '/map').map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full px-2 py-1 text-[10px] sm:text-xs font-medium rounded-lg transition-colors",
                isActive ? "text-primary-700 bg-primary-50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* BhuSetu Assistant Button */}
      <AssistantButton />
    </div>
  );
}
