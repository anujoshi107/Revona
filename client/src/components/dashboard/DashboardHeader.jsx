import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';
import {
  Menu, X, Bell, ChevronDown,
  LayoutDashboard, ArrowRightLeft, BarChart3, Settings, LogOut, User,
} from 'lucide-react';

// Generate initials from a name string
function getInitials(name = '') {
  return name
    .trim()
    .split(' ')
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
}

// Pick a consistent gradient color based on name
function getAvatarGradient(name = '') {
  const gradients = [
    'from-blue-500 to-cyan-400',
    'from-violet-500 to-purple-400',
    'from-emerald-500 to-teal-400',
    'from-rose-500 to-pink-400',
    'from-amber-500 to-orange-400',
  ];
  const idx = name.charCodeAt(0) % gradients.length;
  return gradients[idx] || gradients[0];
}

export default function DashboardHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Read active link from pathname
  const activeLink = (() => {
    if (location.pathname === '/dashboard') return 'Overview';
    if (location.pathname === '/transactions') return 'Transactions';
    return 'Overview';
  })();

  // Read user from localStorage (set during login)
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')) || {}; }
    catch { return {}; }
  })();
  const displayName = user?.name || 'User';
  const displayEmail = user?.email || '';
  const initials = getInitials(displayName);
  const gradient = getAvatarGradient(displayName);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Transactions', icon: ArrowRightLeft, path: '/transactions' },
    { name: 'Reports', icon: BarChart3, path: '#' },
    { name: 'Settings', icon: Settings, path: '#' },
  ];

  // Reusable initials avatar component
  const Avatar = ({ size = 'md' }) => {
    const sizeClasses = size === 'lg' ? 'h-10 w-10 text-sm' : 'h-9 w-9 text-xs';
    return (
      <div className={`relative flex-shrink-0 ${sizeClasses}`}>
        <div
          className={`${sizeClasses} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white ring-2 ring-blue-500/40 ring-offset-1 ring-offset-slate-950`}
        >
          {initials}
        </div>
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
      </div>
    );
  };

  return (
    <header className="sticky top-0 w-full border-b border-slate-800/40 bg-slate-950/70 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeLink === link.name;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white bg-slate-800/60 border border-slate-700/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Bell + Avatar Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {/* Bell */}
            <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-slate-950 animate-pulse" />
            </button>

            {/* Avatar + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <Avatar />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight">{displayName}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[120px]">{displayEmail}</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800/60 bg-slate-900/95 shadow-2xl backdrop-blur-xl overflow-hidden">
                  {/* User info header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800/60">
                    <Avatar size="lg" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                      <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
                    </div>
                  </div>

                  {/* Sign Out */}
                  <div className="p-1.5">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/40 bg-slate-950/95 backdrop-blur-lg">
          <div className="space-y-1 px-3 py-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeLink === link.name;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-white bg-slate-900 border border-slate-800'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-400' : 'text-slate-450'}`} />
                  {link.name}
                </Link>
              );
            })}

            {/* Mobile user + sign out */}
            <div className="mt-2 pt-3 border-t border-slate-800/60 px-1">
              <div className="flex items-center gap-3 px-3 py-2 mb-1">
                <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white text-xs ring-2 ring-blue-500/40`}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
