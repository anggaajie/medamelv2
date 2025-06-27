import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { JobListing, UserRole, JobType, ExperienceLevel } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import { SearchIcon } from '@/components/icons/SidebarIcons';
import { useRealtimeJobPostings } from '@/hooks/useRealtime';
import { trackEvent } from '@/utils/analytics';

const JobSearchPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter states
  const [filterLocation, setFilterLocation] = useState('');
  const [filterJobType, setFilterJobType] = useState<JobType | ''>('');
  const [filterExperience, setFilterExperience] = useState<ExperienceLevel | ''>('');
  const [filterMinSalary, setFilterMinSalary] = useState<string>('');

  // Use realtime hook for job listings
  const { jobs, loading } = useRealtimeJobPostings({
    isActive: true,
    category: filterJobType || undefined,
  });

  // Client-side filtering for search term and location
  const filteredJobListings = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearchTerm = searchTerm ? 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.skillsRequired && job.skillsRequired.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
        : true;
      const matchesLocation = filterLocation ? job.location.toLowerCase().includes(filterLocation.toLowerCase()) : true;
      return matchesSearchTerm && matchesLocation;
    });
  }, [jobs, searchTerm, filterLocation]);

  const handleSearch = () => {
    trackEvent('job_search', {
      query: searchTerm,
      location: filterLocation,
      jobType: filterJobType,
      experienceLevel: filterExperience,
      resultsCount: filteredJobListings.length
    });
    setError(null);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    trackEvent('job_filter_changed', {
      filterType: filterType,
      value: value,
      currentQuery: searchTerm
    });
  };

  const handleJobClick = (job: JobListing) => {
    trackEvent('job_clicked', {
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      jobType: job.jobType,
      from: 'search_results'
    });
  };

  const jobTypeOptions = [
    { value: JobType.FULL_TIME, label: 'Full Time', icon: '💼' },
    { value: JobType.PART_TIME, label: 'Part Time', icon: '⏰' },
    { value: JobType.CONTRACT, label: 'Kontrak', icon: '📋' },
    { value: JobType.INTERNSHIP, label: 'Magang', icon: '🎓' },
    { value: JobType.FREELANCE, label: 'Freelance', icon: '🆓' },
  ];

  const experienceOptions = [
    { value: ExperienceLevel.ENTRY_LEVEL, label: 'Entry Level', icon: '🌱' },
    { value: ExperienceLevel.JUNIOR, label: 'Junior', icon: '📈' },
    { value: ExperienceLevel.MID_LEVEL, label: 'Mid Level', icon: '🚀' },
    { value: ExperienceLevel.SENIOR_LEVEL, label: 'Senior', icon: '⭐' },
    { value: ExperienceLevel.MANAGER, label: 'Manager', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🔍</span>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 tracking-tight">
                    Cari Lowongan Kerja
                  </h1>
                  <p className="text-lg text-slate-300 mt-2">
                    Temukan pekerjaan impian Anda dari ribuan lowongan tersedia
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 font-medium">Lowongan Terbaru</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <span className="text-slate-300 font-medium">Perusahaan Terpercaya</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                  <span className="text-slate-300 font-medium">Data Realtime</span>
                </div>
              </div>
            </div>
            
            <div className="lg:ml-8">
              {currentUser?.role === UserRole.COMPANY && (
                <Link
                  to={APP_ROUTES.POST_JOB}
                  className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <span className="text-xl">➕</span>
                  Post Lowongan
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">🔍 Filter Pencarian</h2>
            <p className="text-slate-400">Sempitkan pencarian Anda dengan filter yang tersedia</p>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Bar */}
            <div className="space-y-2">
              <label htmlFor="search-term" className="block text-sm font-medium text-slate-300">
                Kata Kunci Pencarian
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SearchIcon className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  id="search-term"
                  type="text"
                  placeholder="Cari posisi, perusahaan, atau skill..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleFilterChange('search', e.target.value);
                  }}
                  className="w-full bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-400 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Location Filter */}
              <div className="space-y-2">
                <label htmlFor="filter-location" className="block text-sm font-medium text-slate-300">
                  📍 Lokasi
                </label>
                <input
                  id="filter-location"
                  type="text"
                  value={filterLocation}
                  onChange={(e) => {
                    setFilterLocation(e.target.value);
                    handleFilterChange('location', e.target.value);
                  }}
                  placeholder="Contoh: Jakarta"
                  className="w-full bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>

              {/* Job Type Filter */}
              <div className="space-y-2">
                <label htmlFor="filter-job-type" className="block text-sm font-medium text-slate-300">
                  💼 Tipe Pekerjaan
                </label>
                <select
                  id="filter-job-type"
                  value={filterJobType}
                  onChange={(e) => {
                    setFilterJobType(e.target.value as JobType | '');
                    handleFilterChange('jobType', e.target.value);
                  }}
                  className="w-full bg-slate-700/50 border border-slate-600/50 text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                >
                  <option value="">Semua Tipe</option>
                  {jobTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level Filter */}
              <div className="space-y-2">
                <label htmlFor="filter-experience" className="block text-sm font-medium text-slate-300">
                  ⭐ Level Pengalaman
                </label>
                <select
                  id="filter-experience"
                  value={filterExperience}
                  onChange={(e) => {
                    setFilterExperience(e.target.value as ExperienceLevel | '');
                    handleFilterChange('experience', e.target.value);
                  }}
                  className="w-full bg-slate-700/50 border border-slate-600/50 text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                >
                  <option value="">Semua Level</option>
                  {experienceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Filter */}
              <div className="space-y-2">
                <label htmlFor="filter-salary" className="block text-sm font-medium text-slate-300">
                  💰 Gaji Minimum
                </label>
                <input
                  id="filter-salary"
                  type="number"
                  value={filterMinSalary}
                  onChange={(e) => {
                    setFilterMinSalary(e.target.value);
                    handleFilterChange('salary', e.target.value);
                  }}
                  placeholder="Masukkan nominal"
                  className="w-full bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={handleSearch}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <span>🔍</span>
                Cari Pekerjaan
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilterLocation('');
                  setFilterJobType('');
                  setFilterExperience('');
                  setFilterMinSalary('');
                  trackEvent('job_search_reset', {});
                }}
                className="sm:flex-none sm:w-auto bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 border border-slate-600/50 flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {loading && jobs.length === 0 ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <Spinner size="lg" />
                <p className="text-slate-400 mt-4">Memuat lowongan...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-6">
              <p className="text-red-300 font-medium text-center">{error}</p>
            </div>
          ) : filteredJobListings.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-slate-600/20 flex items-center justify-center">
                  <span className="text-5xl">🔍</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">Tidak ada lowongan ditemukan</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                {searchTerm || filterLocation || filterJobType || filterExperience || filterMinSalary
                  ? "Coba ubah kata kunci atau filter pencarian Anda untuk hasil yang lebih luas"
                  : "Belum ada lowongan yang tersedia saat ini. Silakan coba lagi nanti."
                }
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">
                    {filteredJobListings.length} Lowongan Ditemukan
                  </h2>
                  <p className="text-slate-400 mt-1">Hasil pencarian berdasarkan filter Anda</p>
                </div>
                {loading && jobs.length > 0 && (
                  <div className="flex items-center text-blue-400">
                    <Spinner size="sm" />
                    <span className="ml-2 text-sm">Memperbarui...</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobListings.map((job) => (
                  <Link 
                    key={job.id} 
                    to={APP_ROUTES.JOB_DETAIL.replace(':jobId', job.id)}
                    onClick={() => handleJobClick(job)}
                    className="group"
                  >
                    <div className="transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-slate-900/20">
                      <JobCard job={job} />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Statistics */}
              {filteredJobListings.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center hover:bg-slate-800/70 transition-all duration-300">
                    <div className="text-3xl font-bold text-slate-100 mb-2">{filteredJobListings.length}</div>
                    <div className="text-sm text-slate-400">Total Lowongan</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center hover:bg-slate-800/70 transition-all duration-300">
                    <div className="text-3xl font-bold text-slate-100 mb-2">
                      {new Set(filteredJobListings.map(j => j.companyId)).size}
                    </div>
                    <div className="text-sm text-slate-400">Perusahaan</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center hover:bg-slate-800/70 transition-all duration-300">
                    <div className="text-3xl font-bold text-slate-100 mb-2">
                      {new Set(filteredJobListings.map(j => j.jobType)).size}
                    </div>
                    <div className="text-sm text-slate-400">Tipe Pekerjaan</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center hover:bg-slate-800/70 transition-all duration-300">
                    <div className="text-3xl font-bold text-slate-100 mb-2">
                      {filteredJobListings.filter(j => j.salaryMin && j.salaryMin > 0).length}
                    </div>
                    <div className="text-sm text-slate-400">Dengan Gaji</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
