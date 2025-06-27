import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { APP_ROUTES } from '@/constants';
import { trackEvent } from '@/utils/analytics';
import * as Icons from '@/components/icons/SidebarIcons';


interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { currentUser, clearCurrentUser } = useAuth();
  const location = useLocation();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | HTMLButtonElement)[]>([]);

  const handleNavigation = (route: string, label: string) => {
    trackEvent('navigation', {
      from: 'sidebar',
      to: route,
      label: label,
      userRole: currentUser?.role || 'unknown'
    });
  };

  const handleLogout = async () => {
    trackEvent('logout', {
      userRole: currentUser?.role || 'unknown',
      from: 'sidebar'
    });
    try {
      await clearCurrentUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const getNavItems = () => {
    if (!currentUser) return [];

    const baseItems = [
      {
        path: APP_ROUTES.DASHBOARD,
        label: 'Beranda',
        icon: <Icons.HomeIcon className="w-5 h-5" aria-hidden="true" />,
        active: isActive(APP_ROUTES.DASHBOARD)
      },
      {
        path: APP_ROUTES.JOBS,
        label: 'Lowongan',
        icon: <Icons.BriefcaseIcon className="w-5 h-5" aria-hidden="true" />,
        active: isActive(APP_ROUTES.JOBS)
      },
      {
        path: APP_ROUTES.INTERNSHIPS,
        label: 'Program Magang',
        icon: <Icons.AcademicCapIcon className="w-5 h-5" aria-hidden="true" />,
        active: isActive(APP_ROUTES.INTERNSHIPS)
      },
      {
        path: APP_ROUTES.TRAINING_CATALOG,
        label: 'Pelatihan',
        icon: <Icons.AcademicCapIcon className="w-5 h-5" aria-hidden="true" />,
        active: isActive(APP_ROUTES.TRAINING_CATALOG)
      },
      {
        path: APP_ROUTES.PSYCHOMETRIC_TESTS_OVERVIEW,
        label: 'Tes Psikometri',
        icon: <Icons.BeakerIcon className="w-5 h-5" aria-hidden="true" />,
        active: isActive(APP_ROUTES.PSYCHOMETRIC_TESTS_OVERVIEW)
      },
      {
        path: APP_ROUTES.CV_BUILDER,
        label: 'CV Builder',
        icon: <Icons.DocumentTextIcon className="w-5 h-5" aria-hidden="true" />,
        active: isActive(APP_ROUTES.CV_BUILDER)
      },
      {
        path: APP_ROUTES.PROFILE,
        label: 'Profil',
        icon: <Icons.UserCircleIcon className="w-5 h-5" aria-hidden="true" />,
        active: isActive(APP_ROUTES.PROFILE)
      }
    ];

    // Add role-specific items
    if (currentUser.role === UserRole.COMPANY) {
      baseItems.push(
        {
          path: APP_ROUTES.COMPANY_JOBS,
          label: 'Kelola Lowongan',
          icon: <Icons.BriefcaseIcon className="w-5 h-5" aria-hidden="true" />,
          active: isActive(APP_ROUTES.COMPANY_JOBS)
        },
        {
          path: APP_ROUTES.COMPANY_INTERNSHIPS,
          label: 'Kelola Program Magang',
          icon: <Icons.AcademicCapIcon className="w-5 h-5" aria-hidden="true" />,
          active: isActive(APP_ROUTES.COMPANY_INTERNSHIPS)
        },
        {
          path: APP_ROUTES.COMPANY_INTERNSHIP_APPLICATIONS,
          label: 'Pelamar Magang',
          icon: <Icons.UsersIcon className="w-5 h-5" aria-hidden="true" />,
          active: isActive(APP_ROUTES.COMPANY_INTERNSHIP_APPLICATIONS)
        },
        {
          path: APP_ROUTES.COMPANY_APPLICATIONS,
          label: 'Lamaran Masuk',
          icon: <Icons.DocumentTextIcon className="w-5 h-5" aria-hidden="true" />,
          active: isActive(APP_ROUTES.COMPANY_APPLICATIONS)
        }
      );
    }

    if (currentUser.role === UserRole.JOB_SEEKER) {
      baseItems.push(
        {
          path: APP_ROUTES.MY_APPLICATIONS,
          label: 'Lamaran Saya',
          icon: <Icons.DocumentTextIcon className="w-5 h-5" aria-hidden="true" />,
          active: isActive(APP_ROUTES.MY_APPLICATIONS)
        },
        {
          path: APP_ROUTES.MY_INTERNSHIP_APPLICATIONS,
          label: 'Lamaran Magang',
          icon: <Icons.AcademicCapIcon className="w-5 h-5" aria-hidden="true" />,
          active: isActive(APP_ROUTES.MY_INTERNSHIP_APPLICATIONS)
        }
      );
    }

    if (currentUser.role === UserRole.TRAINING_PROVIDER) {
      baseItems.push(
        {
          path: APP_ROUTES.PROVIDER_TRAININGS,
          label: 'Kelola Pelatihan',
          icon: <Icons.AcademicCapIcon className="w-5 h-5" aria-hidden="true" />,
          active: isActive(APP_ROUTES.PROVIDER_TRAININGS)
        },
        {
          path: APP_ROUTES.PROVIDER_REGISTRATIONS,
          label: 'Pendaftaran',
          icon: <Icons.UsersIcon className="w-5 h-5" aria-hidden="true" />,
          active: isActive(APP_ROUTES.PROVIDER_REGISTRATIONS)
        }
      );
    }

    if (currentUser.role === UserRole.ADMIN) {
      baseItems.push(
        {
          path: APP_ROUTES.ADMIN_DASHBOARD,
          label: 'Dashboard Admin',
          icon: <Icons.ShieldCheckIcon className="w-5 h-5" aria-hidden="true" />,
          active: isActive(APP_ROUTES.ADMIN_DASHBOARD)
        },
        {
          path: APP_ROUTES.ADMIN_USER_MANAGEMENT,
          label: 'Kelola Pengguna',
          icon: <Icons.UsersIcon className="w-5 h-5" aria-hidden="true" />,
          active: isActive(APP_ROUTES.ADMIN_USER_MANAGEMENT)
        }
      );
    }

    return baseItems;
  };

  const navItems = getNavItems();

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (index + 1) % menuItemsRef.current.length;
        menuItemsRef.current[nextIndex]?.focus();
        setFocusedIndex(nextIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = index === 0 ? menuItemsRef.current.length - 1 : index - 1;
        menuItemsRef.current[prevIndex]?.focus();
        setFocusedIndex(prevIndex);
        break;
      case 'Home':
        e.preventDefault();
        menuItemsRef.current[0]?.focus();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        const lastIndex = menuItemsRef.current.length - 1;
        menuItemsRef.current[lastIndex]?.focus();
        setFocusedIndex(lastIndex);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (e.currentTarget.tagName === 'A') {
          (e.currentTarget as HTMLAnchorElement).click();
        } else if (e.currentTarget.tagName === 'BUTTON') {
          handleLogout();
        }
        break;
    }
  };

  // Focus management
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.setAttribute('role', 'navigation');
      sidebarRef.current.setAttribute('aria-label', 'Main navigation');
    }
  }, []);

  const addMenuItemRef = (el: HTMLAnchorElement | HTMLButtonElement | null, index: number) => {
    if (el) {
      menuItemsRef.current[index] = el;
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full z-40 flex flex-col bg-slate-800 border-r border-slate-700 shadow-sm transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}
      tabIndex={-1}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {!isCollapsed && (
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-slate-100">Medamel</h1>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-300"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"} />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => handleNavigation(item.path, item.label)}
              ref={(el) => addMenuItemRef(el, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                item.active
                  ? 'bg-blue-600 text-white border-r-2 border-blue-400'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-slate-100'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
              aria-current={item.active ? 'page' : undefined}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={`${item.active ? 'text-white' : 'text-slate-400'} ${isCollapsed ? '' : 'mr-3'}`}>
                {item.icon}
              </div>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        {currentUser && (
          <div className="p-3 border-t border-slate-700">
            {!isCollapsed && (
              <div className="mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {currentUser.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">
                      {currentUser.displayName || 'User'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              ref={(el) => addMenuItemRef(el, navItems.length)}
              onKeyDown={(e) => handleKeyDown(e, navItems.length)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors duration-200 ${
                isCollapsed ? 'justify-center px-2' : ''
              }`}
              title={isCollapsed ? 'Keluar' : undefined}
            >
              <Icons.LogoutIcon className={`w-5 h-5 text-slate-400 ${isCollapsed ? '' : 'mr-3'}`} aria-hidden="true" />
              {!isCollapsed && <span>Keluar</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 
