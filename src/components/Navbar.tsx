import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import NotificationBell from './NotificationBell';
import * as Icons from './icons/PhosphorIcons';
import { APP_ROUTES } from '@/constants';
import { UserRole } from '@/types';

interface NavItem {
  path?: string;
  onClick?: () => void;
  icon: (active: boolean) => React.ReactNode;
  label: string;
}

const Navbar: React.FC = () => {
  const { currentUser, clearCurrentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await clearCurrentUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path?: string) => (path ? location.pathname === path : false);
  
  const mainNavItems: NavItem[] = currentUser ? [
    {
      path: APP_ROUTES.DASHBOARD,
      label: 'Beranda',
      icon: (active) => <Icons.HomeIcon size={28} weight={active ? 'fill' : 'regular'} />,
    },
    {
      path: APP_ROUTES.JOBS,
      label: 'Lowongan',
      icon: (active) => <Icons.BriefcaseIcon size={28} weight={active ? 'fill' : 'regular'} />,
    },
    {
      path: APP_ROUTES.INTERNSHIPS,
      label: 'Magang',
      icon: (active) => <Icons.AcademicCapIcon size={28} weight={active ? 'fill' : 'regular'} />,
    },
    ...(() => {
        let actionItem: NavItem | null = null;
        switch (currentUser.role) {
            case UserRole.JOB_SEEKER:
            actionItem = { path: APP_ROUTES.CV_BUILDER, label: 'CV', icon: (active) => <Icons.PencilIcon size={28} weight={active ? 'fill' : 'regular'} /> };
            break;
            case UserRole.COMPANY:
            actionItem = { path: APP_ROUTES.POST_JOB, label: 'Post', icon: (active) => <Icons.PlusCircleIcon size={28} weight={active ? 'fill' : 'regular'} /> };
            break;
            case UserRole.TRAINING_PROVIDER:
            actionItem = { path: APP_ROUTES.POST_TRAINING, label: 'Post', icon: (active) => <Icons.PlusCircleIcon size={28} weight={active ? 'fill' : 'regular'} /> };
            break;
            case UserRole.ADMIN:
            actionItem = { path: APP_ROUTES.ADMIN_DASHBOARD, label: 'Admin', icon: (active) => <Icons.ShieldCheckIcon size={28} weight={active ? 'fill' : 'regular'} /> };
            break;
        }
        return actionItem ? [actionItem] : [];
    })(),
    {
      path: APP_ROUTES.PROFILE,
      label: 'Profil',
      icon: (active) => <Icons.UserCircleIcon size={28} weight={active ? 'fill' : 'regular'} />,
    },
  ] : [
    {
        path: APP_ROUTES.LOGIN,
        label: 'Masuk',
        icon: (active) => <Icons.HomeIcon size={28} weight={active ? 'fill' : 'regular'} />,
    },
    {
        path: APP_ROUTES.SIGNUP,
        label: 'Daftar',
        icon: (active) => <Icons.UserPlusIcon size={28} weight={active ? 'fill' : 'regular'} />,
    },
  ];

  const moreNavItem: NavItem = {
    onClick: () => setIsMoreMenuOpen(!isMoreMenuOpen),
    label: 'Lainnya',
    icon: (active) => <Icons.DotsThreeIcon size={28} weight={active ? 'fill' : 'regular'} />,
  };
  
  const navItems = currentUser ? [...mainNavItems.slice(0, 4), moreNavItem] : mainNavItems;

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Brand */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/src/assets/logo-medamel.png" alt="Medamel Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-slate-100">Medamel</span>
          </Link>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <NotificationBell />
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }
              }}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={isUserMenuOpen ? 'true' : 'false'}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {currentUser?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-200 hidden md:block">
                {currentUser?.displayName || 'User'}
              </span>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                ref={userMenuRef}
                className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-50"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-slate-700">
                    <p className="text-sm font-medium text-slate-100">
                      {currentUser?.displayName || 'User'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {currentUser?.email}
                    </p>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors duration-200"
                    role="menuitem"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </div>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors duration-200"
                    role="menuitem"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
