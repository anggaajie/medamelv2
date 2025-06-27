import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import * as Icons from './icons/PhosphorIcons';
import { APP_ROUTES } from '@/constants';
import { UserRole } from '@/types';

interface FabAction {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const FloatingMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  const getFabActions = (): FabAction[] => {
    if (!currentUser) return [];

    const generalActions: FabAction[] = [
      { path: APP_ROUTES.DASHBOARD, icon: <Icons.HomeIcon size={24} />, label: 'Beranda' },
      { path: APP_ROUTES.JOBS, icon: <Icons.BriefcaseIcon size={24} />, label: 'Lowongan' },
      { path: APP_ROUTES.TRAINING_CATALOG, icon: <Icons.AcademicCapIcon size={24} />, label: 'Pelatihan' },
      { path: APP_ROUTES.PSYCHOMETRIC_TESTS_OVERVIEW, icon: <Icons.PsikometriIcon size={24} />, label: 'Tes Psikometri' },
      { path: APP_ROUTES.PROFILE, icon: <Icons.ProfilIcon size={24} />, label: 'Profil' },
    ];

    let roleSpecificActions: FabAction[] = [];
    switch (currentUser.role) {
      case UserRole.JOB_SEEKER:
        roleSpecificActions = [
          { path: APP_ROUTES.CV_BUILDER, icon: <Icons.PencilIcon size={24} />, label: 'Edit CV' },
          { path: APP_ROUTES.MY_APPLICATIONS, icon: <Icons.BriefcaseIcon size={24} />, label: 'Lihat Lamaran' },
        ];
        break;
      case UserRole.COMPANY:
        roleSpecificActions = [
          { path: APP_ROUTES.POST_JOB, icon: <Icons.PlusCircleIcon size={24} />, label: 'Buat Lowongan' },
          { path: APP_ROUTES.COMPANY_APPLICATIONS, icon: <Icons.UsersIcon size={24} />, label: 'Lihat Lamaran' },
        ];
        break;
      case UserRole.TRAINING_PROVIDER:
        roleSpecificActions = [
          { path: APP_ROUTES.POST_TRAINING, icon: <Icons.PlusCircleIcon size={24} />, label: 'Buat Pelatihan' },
          { path: APP_ROUTES.PROVIDER_REGISTRATIONS, icon: <Icons.UsersIcon size={24} />, label: 'Lihat Pendaftar' },
        ];
        break;
      default:
        roleSpecificActions = [];
    }

    // Role-specific actions will appear closer to the main FAB
    return [...generalActions, ...roleSpecificActions];
  };

  const actions = getFabActions();
  if (!currentUser) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <div className="relative flex flex-col items-center gap-3">
        {/* Action Buttons */}
        <div
          className={`transition-all duration-300 ease-in-out flex flex-col-reverse items-center gap-3 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          } max-h-[70vh] overflow-y-auto pr-1`}
        >
          {actions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="bg-gray-800 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-all duration-200"
              aria-label={action.label}
              onClick={() => setIsOpen(false)}
            >
              {action.icon}
            </Link>
          ))}
        </div>

        {/* Main FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/30 hover:bg-gray-900 focus:outline-none transition-transform duration-300 ease-in-out"
          aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
        >
          <div className="transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}>
            <Icons.PlusCircleIcon size={32} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default FloatingMenu; 