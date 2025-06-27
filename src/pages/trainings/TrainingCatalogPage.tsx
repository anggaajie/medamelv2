import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { TrainingProgram, UserRole, TrainingCategory, TrainingCategories } from '@/types';
import TrainingCard from '@/components/trainings/TrainingCard';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import { SearchIcon, AcademicCapIcon, PlusCircleIcon } from '@/components/icons/SidebarIcons';
import { useRealtimeTrainingPrograms } from '@/hooks/useRealtime';
import VirtualList from '@/components/VirtualList';
import LazyImage from '@/components/LazyImage';

const ITEM_HEIGHT = 140;
const CONTAINER_HEIGHT = 600;

const TrainingCatalogPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filterCategory, setFilterCategory] = useState<TrainingCategory | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Use realtime hook for training programs
  const { programs, loading } = useRealtimeTrainingPrograms();

  // Client-side search and filtering
  const filteredPrograms = useMemo(() => {
    return programs.filter(program => 
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [programs, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by client-side filtering
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-96">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="text-slate-400 mt-4">Memuat katalog pelatihan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!programs || programs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-slate-600/20 flex items-center justify-center">
              <span className="text-4xl">🎓</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-3">Belum ada pelatihan yang tersedia</h2>
            <p className="text-slate-400">Program pelatihan akan segera hadir</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🎓</span>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 tracking-tight">
                  Katalog Pelatihan
                </h1>
                <p className="text-lg text-slate-300 mt-2">
                  Tingkatkan skill dan kompetensi Anda dengan program pelatihan berkualitas tinggi
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-slate-300 font-medium">Program Berkualitas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-slate-300 font-medium">Sertifikasi Resmi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                <span className="text-slate-300 font-medium">Data Realtime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">🔍 Cari & Filter</h2>
            <p className="text-slate-400">Temukan program pelatihan yang sesuai dengan kebutuhan Anda</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div className="space-y-2">
              <label htmlFor="search-training" className="block text-sm font-medium text-slate-300">
                Cari Pelatihan
              </label>
              <div className="relative">
                <input
                  id="search-training"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder-slate-400 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                  placeholder="Cari berdasarkan judul atau penyedia..."
                />
                <SearchIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Filter */}
            <div className="space-y-2">
              <label htmlFor="category-filter" className="block text-sm font-medium text-slate-300">
                Kategori
              </label>
              <select
                id="category-filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as TrainingCategory | '')}
                className="w-full bg-slate-700/50 border border-slate-600/50 text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
              >
                <option value="">Semua Kategori</option>
                {TrainingCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-6">
            <p className="text-red-300 font-medium text-center">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPrograms.length === 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-slate-600/20 flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-3">Tidak ada program pelatihan ditemukan</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Coba ubah kata kunci pencarian atau filter kategori Anda.
            </p>
          </div>
        )}

        {/* Content Grid */}
        {(loading || filteredPrograms.length > 0) && (
          <div className="space-y-8">
            {/* Statistics Header */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">
                    Program Pelatihan Tersedia
                  </h2>
                  <p className="text-slate-400 mt-1">Statistik program pelatihan yang tersedia</p>
                </div>
                {loading && (
                  <div className="flex items-center text-emerald-400">
                    <Spinner size="sm" />
                    <span className="ml-2 text-sm">Memperbarui...</span>
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-slate-700/30 rounded-xl p-6 text-center hover:bg-slate-700/50 transition-all duration-300">
                  <div className="text-3xl font-bold text-slate-100 mb-2">
                    {loading ? <Spinner size="sm" /> : filteredPrograms.length}
                  </div>
                  <div className="text-sm text-slate-400">Total Program</div>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-6 text-center hover:bg-slate-700/50 transition-all duration-300">
                  <div className="text-3xl font-bold text-slate-100 mb-2">
                    {loading ? <Spinner size="sm" /> : new Set(filteredPrograms.map(p => p.providerId)).size}
                  </div>
                  <div className="text-sm text-slate-400">Penyedia Pelatihan</div>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-6 text-center hover:bg-slate-700/50 transition-all duration-300">
                  <div className="text-3xl font-bold text-slate-100 mb-2">
                    {loading ? <Spinner size="sm" /> : new Set(filteredPrograms.map(p => p.category)).size}
                  </div>
                  <div className="text-sm text-slate-400">Kategori</div>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-6 text-center hover:bg-slate-700/50 transition-all duration-300">
                  <div className="text-3xl font-bold text-slate-100 mb-2">
                    {loading ? <Spinner size="sm" /> : filteredPrograms.filter(p => p.cost === 0).length}
                  </div>
                  <div className="text-sm text-slate-400">Program Gratis</div>
                </div>
              </div>
            </div>

            {/* Training Cards Grid */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Daftar Program Pelatihan</h2>
                <p className="text-slate-400">Pilih program yang sesuai dengan kebutuhan Anda</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 animate-pulse">
                      <div className="h-4 bg-slate-700 rounded mb-4"></div>
                      <div className="h-3 bg-slate-700 rounded mb-2"></div>
                      <div className="h-3 bg-slate-700 rounded mb-2"></div>
                      <div className="h-20 bg-slate-700 rounded mb-4"></div>
                      <div className="h-8 bg-slate-700 rounded"></div>
                    </div>
                  ))
                ) : (
                  filteredPrograms.map((program) => (
                    <div key={program.id} className="group">
                      <div className="transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-slate-900/20">
                        <TrainingCard program={program} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingCatalogPage;
