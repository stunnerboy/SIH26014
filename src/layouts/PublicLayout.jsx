import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search, Map as MapIcon, Grid, Info, HelpCircle } from 'lucide-react';
import AssistantButton from '../components/assistant/AssistantButton';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Search Land', path: '/search', icon: Search },
  { label: 'Explore Map', path: '/map', icon: MapIcon },
  { label: 'Services', path: '/services', icon: Grid },
  { label: 'About', path: '/about', icon: Info },
  { label: 'Help', path: '/help', icon: HelpCircle },
];

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      {/* Desktop Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary-700">BhuSetu</span>
              </Link>
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                      location.pathname === item.path
                        ? "border-primary-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="hidden md:flex items-center">
              <Link
                to="/dashboard"
                className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <span className="text-2xl font-bold text-primary-700">BhuSetu</span>
              <p className="mt-2 text-sm text-gray-500">Unified land information platform</p>
              <div className="mt-4 inline-block bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded border border-primary-100">
                Prototype &bull; Demo Data
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Discover</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-sm text-gray-500 hover:text-gray-900">Home</Link></li>
                <li><Link to="/search" className="text-sm text-gray-500 hover:text-gray-900">Search Land</Link></li>
                <li><Link to="/map" className="text-sm text-gray-500 hover:text-gray-900">Explore Map</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Services</h3>
              <ul className="space-y-3">
                <li><Link to="/services" className="text-sm text-gray-500 hover:text-gray-900">All Services</Link></li>
                <li><Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">My Applications</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-sm text-gray-500 hover:text-gray-900">About</Link></li>
                <li><Link to="/help" className="text-sm text-gray-500 hover:text-gray-900">Help</Link></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">&copy; 2024 BhuSetu. Non-official prototype.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 py-2 flex justify-between items-center shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full px-2 py-1 text-xs font-medium rounded-lg transition-colors",
                isActive ? "text-primary-700 bg-primary-50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon className="h-6 w-6 mb-1" />
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
