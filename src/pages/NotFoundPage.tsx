import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '@/constants';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <div className="content-card p-12 max-w-lg mx-auto">
        <h1 className="text-9xl font-extrabold tracking-tight text-slate-900 mb-4">404</h1>
        <h2 className="page-title mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-muted mb-8 max-w-md">
          Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin halaman tersebut telah dipindahkan atau tidak ada lagi.
        </p>
        <Link
          to={APP_ROUTES.DASHBOARD}
          className="btn-primary px-8 py-3 text-lg"
        >
          Kembali ke Dasbor
        </Link>
        <p className="text-center text-sm text-muted mt-8">
          © {new Date().getFullYear()} Medamel. Semua Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
