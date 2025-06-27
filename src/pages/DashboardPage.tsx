import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { APP_ROUTES } from '@/constants';
import * as Icons from '@/components/icons/PhosphorIcons';
import { 
  useRealtimeJobApplications, 
  useRealtimeTrainingRegistrations,
  useRealtimeUserProfile 
} from '@/hooks/useRealtime';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();

  // Realtime data hooks
  const { applications: jobApplications } = useRealtimeJobApplications({
    applicantId: currentUser?.uid,
    status: 'PENDING'
  });

  const { registrations: trainingRegistrations } = useRealtimeTrainingRegistrations({
    userId: currentUser?.uid,
    status: 'ACTIVE'
  });

  const { user: userProfile } = useRealtimeUserProfile(currentUser?.uid || '');

  // Calculate realtime statistics
  const getRealtimeStats = () => {
    if (!currentUser) return { jobApplications: 0, trainingRegistrations: 0, psychometricTests: 0, cvs: 0 };

    return {
      jobApplications: jobApplications.length,
      trainingRegistrations: trainingRegistrations.length,
      psychometricTests: userProfile?.educationHistory?.length || 0,
      cvs: userProfile?.workHistory?.length || 0
    };
  };

  const stats = getRealtimeStats();

  const getDashboardContent = () => {
    if (!currentUser) {
      return {
        title: 'Selamat Datang di Medamel',
        subtitle: 'Platform karir dan pengembangan profesional terdepan',
        cards: [
          {
            title: 'Mulai Karir Anda',
            description: 'Temukan lowongan kerja yang sesuai dengan keahlian dan minat Anda',
            icon: <Icons.LamaranIcon size={28} weight="regular" />,
            link: APP_ROUTES.JOBS,
            color: 'blue'
          },
          {
            title: 'Tingkatkan Skill',
            description: 'Ikuti pelatihan dan sertifikasi untuk meningkatkan kompetensi',
            icon: <Icons.PelatihanIcon size={28} weight="regular" />,
            link: APP_ROUTES.TRAINING_CATALOG,
            color: 'emerald'
          },
          {
            title: 'Buat CV Profesional',
            description: 'Buat dan kelola CV yang menarik untuk peluang karir terbaik',
            icon: <Icons.CVIcon size={28} weight="regular" />,
            link: APP_ROUTES.CV_BUILDER,
            color: 'purple'
          }
        ]
      };
    }

    switch (currentUser.role) {
      case UserRole.JOB_SEEKER:
        return {
          title: `Selamat datang, ${currentUser.displayName || 'Pencari Kerja'}`,
          subtitle: 'Kelola karir dan pengembangan profesional Anda',
          cards: [
            {
              title: 'Cari Lowongan',
              description: 'Temukan lowongan kerja yang sesuai dengan profil Anda',
              icon: <Icons.LamaranIcon size={28} weight="regular" />,
              link: APP_ROUTES.JOBS,
              color: 'blue'
            },
            {
              title: 'Lamaran Saya',
              description: 'Pantau status lamaran kerja yang telah diajukan',
              icon: <Icons.DocumentTextIcon size={28} weight="regular" />,
              link: APP_ROUTES.MY_APPLICATIONS,
              color: 'indigo'
            },
            {
              title: 'Pelatihan',
              description: 'Ikuti pelatihan untuk meningkatkan kompetensi',
              icon: <Icons.PelatihanIcon size={28} weight="regular" />,
              link: APP_ROUTES.TRAINING_CATALOG,
              color: 'emerald'
            },
            {
              title: 'CV Builder',
              description: 'Buat dan kelola CV profesional Anda',
              icon: <Icons.CVIcon size={28} weight="regular" />,
              link: APP_ROUTES.CV_BUILDER,
              color: 'purple'
            }
          ]
        };

      case UserRole.COMPANY:
        return {
          title: `Selamat datang, ${currentUser.displayName || 'Perusahaan'}`,
          subtitle: 'Kelola lowongan dan kandidat perusahaan Anda',
          cards: [
            {
              title: 'Kelola Lowongan',
              description: 'Buat dan kelola lowongan kerja perusahaan',
              icon: <Icons.BriefcaseIcon size={28} weight="regular" />,
              link: APP_ROUTES.COMPANY_JOBS,
              color: 'blue'
            },
            {
              title: 'Lamaran Masuk',
              description: 'Lihat dan kelola lamaran dari kandidat',
              icon: <Icons.DocumentTextIcon size={28} weight="regular" />,
              link: APP_ROUTES.COMPANY_APPLICATIONS,
              color: 'indigo'
            },
            {
              title: 'Post Lowongan',
              description: 'Buat lowongan kerja baru untuk perusahaan',
              icon: <Icons.PlusCircleIcon size={28} weight="regular" />,
              link: APP_ROUTES.POST_JOB,
              color: 'emerald'
            }
          ]
        };

      case UserRole.TRAINING_PROVIDER:
        return {
          title: `Selamat datang, ${currentUser.displayName || 'Provider'}`,
          subtitle: 'Kelola pelatihan dan layanan Anda',
          cards: [
            {
              title: 'Kelola Pelatihan',
              description: 'Buat dan kelola program pelatihan Anda',
              icon: <Icons.AcademicCapIcon size={28} weight="regular" />,
              link: APP_ROUTES.PROVIDER_TRAININGS,
              color: 'emerald'
            },
            {
              title: 'Pendaftaran',
              description: 'Lihat pendaftaran pelatihan dari peserta',
              icon: <Icons.DocumentTextIcon size={28} weight="regular" />,
              link: APP_ROUTES.PROVIDER_REGISTRATIONS,
              color: 'indigo'
            },
            {
              title: 'Post Pelatihan',
              description: 'Buat program pelatihan baru',
              icon: <Icons.PlusCircleIcon size={28} weight="regular" />,
              link: APP_ROUTES.POST_TRAINING,
              color: 'blue'
            }
          ]
        };

      case UserRole.ADMIN:
        return {
          title: `Selamat datang, ${currentUser.displayName || 'Admin'}`,
          subtitle: 'Kelola sistem dan pengguna platform',
          cards: [
            {
              title: 'Dashboard Admin',
              description: 'Akses panel administrasi sistem',
              icon: <Icons.ShieldCheckIcon size={28} weight="regular" />,
              link: APP_ROUTES.ADMIN_DASHBOARD,
              color: 'red'
            },
            {
              title: 'Kelola Pengguna',
              description: 'Kelola data pengguna platform',
              icon: <Icons.UsersIcon size={28} weight="regular" />,
              link: APP_ROUTES.ADMIN_USER_MANAGEMENT,
              color: 'blue'
            },
            {
              title: 'Log Aktivitas',
              description: 'Pantau aktivitas pengguna sistem',
              icon: <Icons.ChartLineIcon size={28} weight="regular" />,
              link: APP_ROUTES.ADMIN_ACTIVITY_LOG,
              color: 'purple'
            },
            {
              title: 'Test Internship Data',
              description: 'Buat data dummy untuk testing fitur magang',
              icon: <Icons.PlusCircleIcon size={28} weight="regular" />,
              link: APP_ROUTES.TEST_INTERNSHIP_DATA,
              color: 'emerald'
            }
          ]
        };

      default:
        return {
          title: 'Selamat Datang',
          subtitle: 'Pilih menu di bawah untuk memulai',
          cards: []
        };
    }
  };

  const content = getDashboardContent();

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; hover: string } } = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', hover: 'hover:bg-blue-500/20' },
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', hover: 'hover:bg-emerald-500/20' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', hover: 'hover:bg-purple-500/20' },
      indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', hover: 'hover:bg-indigo-500/20' },
      red: { bg: 'bg-red-500/10', text: 'text-red-400', hover: 'hover:bg-red-500/20' }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 tracking-tight">
                {content.title}
              </h1>
              <p className="text-lg text-slate-300 max-w-2xl">
                {content.subtitle}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-400 font-medium">Data diperbarui secara realtime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-400">Lamaran Aktif</div>
                <div className="text-3xl font-bold text-slate-100">{stats.jobApplications}</div>
              </div>
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-300">
                <Icons.LamaranIcon size={28} weight="regular" className="text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-400">Pelatihan Diikuti</div>
                <div className="text-3xl font-bold text-slate-100">{stats.trainingRegistrations}</div>
              </div>
              <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300">
                <Icons.PelatihanIcon size={28} weight="regular" className="text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-400">Tes Psikometri</div>
                <div className="text-3xl font-bold text-slate-100">{stats.psychometricTests}</div>
              </div>
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-300">
                <Icons.PsikometriIcon size={28} weight="regular" className="text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-400">CV Dibuat</div>
                <div className="text-3xl font-bold text-slate-100">{stats.cvs}</div>
              </div>
              <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors duration-300">
                <Icons.CVIcon size={28} weight="regular" className="text-indigo-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Aksi Cepat</h2>
            <p className="text-slate-400">Akses fitur-fitur utama dengan cepat</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.cards.map((card, index) => {
              const colorClasses = getColorClasses(card.color);
              return (
                <Link
                  key={index}
                  to={card.link}
                  className={`group relative bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-900/20`}
                >
                  <div className="space-y-4">
                    <div className={`w-16 h-16 ${colorClasses.bg} rounded-xl flex items-center justify-center group-hover:${colorClasses.hover} transition-colors duration-300`}>
                      {React.cloneElement(card.icon, { 
                        className: colorClasses.text
                      })}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-700/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
