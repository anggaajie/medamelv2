import React from 'react';
import { Link } from 'react-router-dom';
import { JobListing, JobType, ExperienceLevel } from '@/types';
import { APP_ROUTES } from '@/constants';

interface JobCardProps {
  job: JobListing;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Gaji tidak dicantumkan';
    const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
    if (min) return `Mulai dari ${formatter.format(min)}`;
    if (max) return `Hingga ${formatter.format(max)}`;
    return 'Gaji tidak dicantumkan';
  };

  const getJobTypeColor = (jobType: JobType) => {
    switch (jobType) {
      case JobType.FULL_TIME:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case JobType.PART_TIME:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case JobType.CONTRACT:
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case JobType.INTERNSHIP:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case JobType.FREELANCE:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getExperienceColor = (level: ExperienceLevel) => {
    switch (level) {
      case ExperienceLevel.ENTRY_LEVEL:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case ExperienceLevel.JUNIOR:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case ExperienceLevel.MID_LEVEL:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case ExperienceLevel.SENIOR_LEVEL:
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case ExperienceLevel.MANAGER:
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case ExperienceLevel.EXECUTIVE:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 group h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {job.companyLogoUrl ? (
          <img 
            src={job.companyLogoUrl} 
            alt={`${job.companyName} logo`} 
            className="w-16 h-16 object-contain rounded-xl border border-slate-600/50 p-2 bg-slate-900/50 group-hover:border-slate-500/50 transition-colors duration-300" 
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-indigo-700/20 border border-blue-500/20 text-blue-400 flex items-center justify-center rounded-xl text-xl font-bold shadow-lg group-hover:from-blue-600/30 group-hover:to-indigo-700/30 transition-all duration-300">
            {job.companyName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 mb-2">
            <Link to={APP_ROUTES.JOB_DETAIL.replace(':jobId', job.id)}>
              {job.title}
            </Link>
          </h2>
          <p className="text-lg font-semibold text-slate-300 mb-2">{job.companyName}</p>
          <div className="flex items-center text-slate-400">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{job.location}</span>
          </div>
        </div>
      </div>

      {/* Job Type and Experience */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${getJobTypeColor(job.jobType)}`}>
          <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
          {job.jobType}
        </span>
        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${getExperienceColor(job.experienceLevel)}`}>
          <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {job.experienceLevel}
        </span>
      </div>

      {/* Salary */}
      <div className="mb-6">
        <div className="flex items-center text-slate-300 bg-slate-700/30 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className="font-semibold text-sm">{formatSalary(job.salaryMin, job.salaryMax)}</span>
        </div>
      </div>

      {/* Skills */}
      {job.skillsRequired && job.skillsRequired.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {job.skillsRequired.slice(0, 3).map(skill => (
              <span 
                key={skill} 
                className="inline-block bg-slate-700/50 text-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium border border-slate-600/50 group-hover:border-slate-500/50 transition-colors duration-300"
              >
                {skill}
              </span>
            ))}
            {job.skillsRequired.length > 3 && (
              <span className="text-xs text-slate-500 font-medium">
                +{job.skillsRequired.length - 3} lainnya
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 mt-auto">
        <p className="text-xs text-slate-500">
          Diposting {new Date(job.postedAt).toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })}
        </p>
        <Link 
          to={APP_ROUTES.JOB_DETAIL.replace(':jobId', job.id)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
        >
          Lihat Detail
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
