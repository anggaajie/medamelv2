import React from 'react';
import { Link } from 'react-router-dom';
import { InternshipProgram } from '@/types';
import { APP_ROUTES } from '@/constants';
import * as Icons from '@/components/icons/PhosphorIcons';

interface InternshipCardProps {
  internship: InternshipProgram;
}

const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {
  const formatStipend = (stipend?: number) => {
    if (!stipend || stipend === 0) return 'Unpaid';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stipend);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Teknologi Informasi': 'bg-blue-100 text-blue-800',
      'Bisnis & Manajemen': 'bg-emerald-100 text-emerald-800',
      'Pemasaran & Penjualan': 'bg-orange-100 text-orange-800',
      'Keuangan & Akuntansi': 'bg-green-100 text-green-800',
      'Desain & Kreatif': 'bg-pink-100 text-pink-800',
      'Sumber Daya Manusia': 'bg-purple-100 text-purple-800',
      'Operasional': 'bg-indigo-100 text-indigo-800',
      'Penelitian & Pengembangan': 'bg-cyan-100 text-cyan-800',
      'Layanan Pelanggan': 'bg-yellow-100 text-yellow-800',
      'Lainnya': 'bg-slate-100 text-slate-800',
    };
    return colors[category as keyof typeof colors] || colors['Lainnya'];
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'Full Time': <Icons.ClockIcon size={16} />,
      'Part Time': <Icons.PauseIcon size={16} />,
      'Remote': <Icons.HomeIcon size={16} />,
      'Hybrid': <Icons.ArrowRightIcon size={16} />,
    };
    return icons[type as keyof typeof icons] || <Icons.BriefcaseIcon size={16} />;
  };

  return (
    <div className="content-card p-6 hover:scale-105 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {internship.companyLogoUrl ? (
            <img 
              src={internship.companyLogoUrl} 
              alt={`${internship.companyName} logo`} 
              className="w-12 h-12 object-contain rounded-lg border border-slate-600"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {internship.companyName.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-2">
              {internship.title}
            </h3>
            <p className="text-slate-300 text-sm">{internship.companyName}</p>
          </div>
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(internship.category)}`}>
          {internship.category}
        </span>
      </div>

      {/* Key Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-slate-300 text-sm">
          <Icons.MapPinIcon size={16} className="mr-2 flex-shrink-0" />
          <span className="truncate">{internship.location}</span>
        </div>
        
        <div className="flex items-center text-slate-300 text-sm">
          <Icons.ClockIcon size={16} className="mr-2 flex-shrink-0" />
          <span>{internship.duration}</span>
        </div>
        
        <div className="flex items-center text-slate-300 text-sm">
          {getTypeIcon(internship.internshipType)}
          <span className="ml-2">{internship.internshipType}</span>
        </div>
        
        <div className="flex items-center text-slate-300 text-sm">
          <Icons.DollarIcon size={16} className="mr-2 flex-shrink-0" />
          <span className="font-medium">{formatStipend(internship.stipend)}</span>
        </div>
      </div>

      {/* Skills */}
      {internship.skillsRequired && internship.skillsRequired.length > 0 && (
        <div className="mb-4">
          <p className="text-slate-400 text-xs mb-2">Skills yang dibutuhkan:</p>
          <div className="flex flex-wrap gap-1">
            {internship.skillsRequired.slice(0, 3).map((skill, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md"
              >
                {skill}
              </span>
            ))}
            {internship.skillsRequired.length > 3 && (
              <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md">
                +{internship.skillsRequired.length - 3} lagi
              </span>
            )}
          </div>
        </div>
      )}

      {/* Benefits */}
      {internship.benefits && internship.benefits.length > 0 && (
        <div className="mb-4">
          <p className="text-slate-400 text-xs mb-2">Benefit:</p>
          <div className="flex flex-wrap gap-1">
            {internship.benefits.slice(0, 2).map((benefit, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-md"
              >
                {benefit}
              </span>
            ))}
            {internship.benefits.length > 2 && (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-md">
                +{internship.benefits.length - 2} lagi
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <div className="text-slate-400 text-xs">
          {internship.currentApplicants} pelamar
          {internship.maxApplicants && ` / ${internship.maxApplicants} maksimal`}
        </div>
        <Link 
          to={APP_ROUTES.INTERNSHIP_DETAIL.replace(':internshipId', internship.id)}
          className="btn-secondary text-sm px-4 py-2"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default InternshipCard; 
