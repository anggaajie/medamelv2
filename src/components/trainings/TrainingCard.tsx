import React from 'react';
import { Link } from 'react-router-dom';
import { TrainingProgram } from '@/types';
import { APP_ROUTES } from '@/constants';

interface TrainingCardProps {
  program: TrainingProgram;
}

const TrainingCard: React.FC<TrainingCardProps> = ({ program }) => {
  const formatCost = (cost: number) => {
    if (cost === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(cost);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Teknologi Informasi': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Pengembangan Diri': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'Bisnis & Manajemen': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'Desain Kreatif': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      'Bahasa': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      'Pemasaran & Penjualan': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      'Keuangan & Akuntansi': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Kesehatan & Kebugaran': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Lainnya': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };
    return colors[category as keyof typeof colors] || colors['Lainnya'];
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 group h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        {program.providerLogoUrl ? (
          <img 
            src={program.providerLogoUrl} 
            alt={`${program.providerName} logo`} 
            className="w-12 h-12 object-contain rounded-xl border border-slate-600/50 p-1 bg-slate-900/50 group-hover:border-slate-500/50 transition-colors duration-300" 
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600/20 to-teal-700/20 border border-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-xl text-lg font-bold shadow-lg group-hover:from-emerald-600/30 group-hover:to-teal-700/30 transition-all duration-300">
            {program.providerName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-300 truncate mb-2">{program.providerName}</p>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${getCategoryColor(program.category)}`}>
            {program.category}
          </span>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors duration-300 mb-6 line-clamp-2 min-h-[3em]">
        <Link to={APP_ROUTES.TRAINING_DETAIL.replace(':programId', program.id)}>
          {program.title}
        </Link>
      </h2>
      
      {/* Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center text-sm text-slate-400 bg-slate-700/30 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Durasi: {program.duration}</span>
        </div>
        
        <div className="flex items-center text-sm text-slate-400 bg-slate-700/30 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Lokasi: {program.location}</span>
        </div>
        
        <div className="flex items-center text-sm bg-emerald-500/10 rounded-lg px-3 py-2 border border-emerald-500/20">
          <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className="font-bold text-emerald-400">Biaya: {formatCost(program.cost)}</span>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-slate-700/50 space-y-3">
        <Link 
          to={APP_ROUTES.TRAINING_DETAIL.replace(':programId', program.id)}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
        >
          Lihat Detail Pelatihan
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <p className="text-xs text-slate-500 text-center">
          Diposting {new Date(program.postedAt).toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
};

export default TrainingCard;
