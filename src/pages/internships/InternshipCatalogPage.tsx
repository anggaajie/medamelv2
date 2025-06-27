import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InternshipProgram, InternshipCategory, InternshipDuration, InternshipType, InternshipCategories } from '@/types';
import { APP_ROUTES } from '@/constants';
import { UserRole } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/Spinner';
import InternshipCard from '@/components/internships/InternshipCard';
import * as Icons from '@/components/icons/PhosphorIcons';
import { useRealtimeInternshipPrograms } from '@/hooks/useRealtime';
import VirtualList from '@/components/VirtualList';
import LazyImage from '@/components/LazyImage';

const ITEM_HEIGHT = 140;
const CONTAINER_HEIGHT = 600;

const InternshipCatalogPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<InternshipCategory | ''>('');
  const [filterDuration, setFilterDuration] = useState<InternshipDuration | ''>('');
  const [filterType, setFilterType] = useState<InternshipType | ''>('');
  const [filterLocation, setFilterLocation] = useState('');

  // Use realtime hook for internship programs
  const { internships, loading } = useRealtimeInternshipPrograms({
    isActive: true,
  });

  // Client-side filtering
  const filteredInternships = useMemo(() => {
    return internships.filter(internship => {
      const matchesSearchTerm = searchTerm ? 
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        internship.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.skillsRequired.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      
      const matchesCategory = filterCategory ? internship.category === filterCategory : true;
      const matchesDuration = filterDuration ? internship.duration === filterDuration : true;
      const matchesType = filterType ? internship.internshipType === filterType : true;
      const matchesLocation = filterLocation ? internship.location.toLowerCase().includes(filterLocation.toLowerCase()) : true;
      
      return matchesSearchTerm && matchesCategory && matchesDuration && matchesType && matchesLocation;
    });
  }, [internships, searchTerm, filterCategory, filterDuration, filterType, filterLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled client-side
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterDuration('');
    setFilterType('');
    setFilterLocation('');
  };

  const formatStipend = (stipend?: number) => {
    if (!stipend || stipend === 0) return 'Unpaid';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stipend);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (!internships || internships.length === 0) {
    return <div className="text-center text-gray-500 py-12">Belum ada program magang yang tersedia.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Program Magang</h1>
            <p className="text-white">
              Temukan kesempatan magang yang sesuai dengan minat dan karier Anda
              <span className="block text-blue-400 mt-1">🔄 Data diperbarui secara realtime</span>
            </p>
          </div>
          {currentUser && (currentUser.role === UserRole.COMPANY || currentUser.role === UserRole.ADMIN) && (
            <Link to={APP_ROUTES.POST_INTERNSHIP} className="btn-primary">
              <Icons.PlusCircleIcon size={20} />
              <span className="ml-2">Posting Program Magang</span>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="glass p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Cari program magang, perusahaan, atau skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field w-full"
                />
              </div>
              <button type="submit" className="btn-primary px-8">
                <Icons.SearchIcon size={20} />
                <span className="ml-2">Cari</span>
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as InternshipCategory | '')}
                className="input-field"
                aria-label="Filter berdasarkan kategori"
              >
                <option value="">Semua Kategori</option>
                {InternshipCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={filterDuration}
                onChange={(e) => setFilterDuration(e.target.value as InternshipDuration | '')}
                className="input-field"
                aria-label="Filter berdasarkan durasi"
              >
                <option value="">Semua Durasi</option>
                {Object.values(InternshipDuration).map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as InternshipType | '')}
                className="input-field"
                aria-label="Filter berdasarkan tipe magang"
              >
                <option value="">Semua Tipe</option>
                {Object.values(InternshipType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Lokasi..."
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Clear Filters */}
            {(searchTerm || filterCategory || filterDuration || filterType || filterLocation) && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-secondary"
                >
                  <Icons.XIcon size={16} />
                  <span className="ml-2">Hapus Filter</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {loading && internships.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="glass bg-red-500/10 border-red-400/30">
              <p className="text-red-300 font-medium text-center">{error}</p>
            </div>
          ) : filteredInternships.length === 0 ? (
            <div className="glass text-center py-12">
              <div className="text-slate-100 mb-4">
                <Icons.BriefcaseIcon size={64} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Tidak ada program magang ditemukan</h3>
              <p className="text-white">
                {searchTerm || filterCategory || filterDuration || filterType || filterLocation
                  ? "Coba ubah kata kunci atau filter pencarian Anda"
                  : "Belum ada program magang yang tersedia"
                }
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  {filteredInternships.length} Program Magang Ditemukan
                </h2>
                {loading && internships.length > 0 && (
                  <div className="flex items-center text-blue-400">
                    <Spinner size="sm" />
                    <span className="ml-2 text-sm">Memperbarui...</span>
                  </div>
                )}
              </div>

              <VirtualList
                items={filteredInternships}
                itemHeight={ITEM_HEIGHT}
                containerHeight={CONTAINER_HEIGHT}
                overscan={4}
                renderItem={(internship: InternshipProgram, idx: number) => (
                  <div
                    key={internship.id}
                    className="flex items-center bg-white rounded-lg shadow mb-4 p-4 hover:shadow-lg transition-shadow duration-200"
                    tabIndex={0}
                    aria-label={`Magang ${internship.title} di ${internship.companyName}`}
                  >
                    <div className="flex-shrink-0 w-24 h-24 mr-6">
                      <LazyImage
                        src={internship.companyLogoUrl || '/default-company-logo.png'}
                        alt={internship.companyName}
                        className="w-24 h-24 rounded-lg object-cover bg-gray-100"
                        width={96}
                        height={96}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold truncate">{internship.title}</h2>
                      <div className="text-gray-600 text-sm truncate">{internship.companyName}</div>
                      <div className="text-gray-500 text-xs mt-1 truncate">{internship.location} &bull; {internship.internshipType}</div>
                      <div className="text-gray-400 text-xs mt-1 truncate">{internship.duration}</div>
                      <div className="mt-2 text-sm line-clamp-2 text-gray-700">{internship.description.replace(/<[^>]+>/g, '').slice(0, 120)}...</div>
                    </div>
                    <div className="ml-4 flex flex-col items-end">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                        {internship.category}
                      </span>
                      <a
                        href={`/internships/${internship.id}`}
                        className="mt-auto text-blue-600 hover:underline text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        tabIndex={0}
                        aria-label={`Lihat detail magang ${internship.title}`}
                      >
                        Lihat Detail
                      </a>
                    </div>
                  </div>
                )}
              />

              {/* Statistics */}
              {filteredInternships.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="glass p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {filteredInternships.length}
                    </div>
                    <div className="text-sm text-white">Total Program</div>
                  </div>
                  <div className="glass p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {new Set(filteredInternships.map(i => i.companyId)).size}
                    </div>
                    <div className="text-sm text-white">Perusahaan</div>
                  </div>
                  <div className="glass p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {new Set(filteredInternships.map(i => i.category)).size}
                    </div>
                    <div className="text-sm text-white">Kategori</div>
                  </div>
                  <div className="glass p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {filteredInternships.filter(i => i.stipend && i.stipend > 0).length}
                    </div>
                    <div className="text-sm text-white">Berbayar</div>
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

export default InternshipCatalogPage; 
