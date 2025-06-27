import React from 'react';

interface SpinnerProps {
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ fullPage = false, size = 'md', color = 'text-blue-500' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  const spinnerMarkup = (
    <div 
      role="status" 
      aria-label="Loading"
      className={`flex items-center justify-center ${fullPage ? 'fixed inset-0 bg-slate-900/50 z-50' : ''}`}
    >
      <div className={`animate-spin rounded-full border-t-4 border-b-4 border-transparent ${sizeClasses[size]} ${color.startsWith('text-') ? color : `border-${color}-500`}`}
           style={!color.startsWith('text-') ? { borderColor: color, borderTopColor: 'transparent', borderBottomColor: 'transparent'} : { borderTopColor: 'currentColor', borderBottomColor: 'currentColor'}}
      ></div>
    </div>
  );

  if (fullPage) {
    return spinnerMarkup;
  }
  return spinnerMarkup;
};

export default Spinner;
