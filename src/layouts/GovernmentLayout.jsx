import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, FolderKanban, BarChart3,
  FileText, Layers, HelpCircle, LogOut, Menu, X
} from 'lucide-react';
import AssistantButton from '../components/assistant/AssistantButton';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: 'Overview', path: '/government/dashboard', icon: LayoutDashboard },
  { label: 'Land Map', path: '/map', icon: Map, external: true },
  { label: 'Project Planning', path: '/government/project-planning', icon: FolderKanban },
  { label: 'Impact Analysis', path: '/government/impact', icon: BarChart3 },
  { label: 'Reports', path: '/government/reports', icon: FileText },
  { label: 'Data Layers', path: '/government/layers', icon: Layers },
  { label: 'Help', path: '/help', icon: HelpCircle, external: true },
];

export default function GovernmentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  useEffect(() => {
    const role = localStorage.getItem('landstack_role');
    if (role !== 'government') {
      navigate('/government/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('landstack_role');
    navigate('/government/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar backdrop (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200">
          <div>
            <div className="text-lg font-extrabold text-primary-700">BhuSetu</div>
            <div className="text-xs text-gray-500 font-medium leading-tight">Government Planning</div>
          </div>
          <button className="md:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => {
            const isActive = !item.external && (
              item.path === '/government/dashboard'
                ? location.pathname === '/government/dashboard'
                : location.pathname.startsWith(item.path)
            );
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  isActive ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className={cn("h-5 w-5 mr-3 flex-shrink-0",
                  isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-3 p-2 rounded-lg bg-gray-50">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0">D</div>
            <div className="ml-2">
              <p className="text-sm font-semibold text-gray-900">Demo Officer</p>
              <p className="text-xs text-gray-500">Planning Dept.</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-gray-600 text-sm font-medium hidden md:block">Government Planning Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded border border-amber-200">Demo Prototype</span>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">D</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 flex justify-around items-center px-2 py-2 shadow-lg">
        {navItems.filter(i => !i.external).slice(0, 5).map(item => {
          const isActive = item.path === '/government/dashboard'
            ? location.pathname === '/government/dashboard'
            : location.pathname.startsWith(item.path);
          return (
            <Link key={item.path} to={item.path} className={cn(
              "flex flex-col items-center justify-center flex-1 px-1 py-1 text-[10px] font-medium rounded-lg transition-colors",
              isActive ? "text-primary-700 bg-primary-50" : "text-gray-500 hover:text-gray-900"
            )}>
              <item.icon className="h-5 w-5 mb-0.5" />
              <span className="truncate w-full text-center">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* BhuSetu Assistant Button */}
      <AssistantButton />
    </div>
  );
}
