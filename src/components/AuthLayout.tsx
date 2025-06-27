import React from 'react';
import { Outlet } from 'react-router-dom';
import { APP_NAME } from '@/constants';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-slate-100 tracking-tight">{APP_NAME}</h1>
          <p className="text-slate-300 mt-2">Temukan Peluang Karir dan Pelatihan Terbaik Anda</p>
        </div>
        <div className="content-card p-8">
          <Outlet />
        </div>
        <p className="text-center text-sm text-slate-500 mt-8">
            © {new Date().getFullYear()} {APP_NAME}. Semua Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
