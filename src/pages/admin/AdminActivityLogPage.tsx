import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy, startAfter, limit, DocumentData, QueryDocumentSnapshot, where, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UserActivityLog } from '@/types';
import Spinner from '@/components/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/constants';

const LOGS_PER_PAGE = 15;

const AdminActivityLogPage: React.FC = () => {
  const [logs, setLogs] = useState<UserActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filterUserId, setFilterUserId] = useState('');
  const [filterAction, setFilterAction] = useState('');
  
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchLogs = useCallback(async (loadMore = false) => {
    if (!loadMore) {
      setLoading(true);
      setLogs([]);
      setLastVisible(null);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      let q = query(collection(db, 'userActivityLogs'), orderBy('timestamp', 'desc'));

      if (filterUserId.trim()) {
        q = query(q, where('userId', '==', filterUserId.trim()));
      }
      if (filterAction.trim()) {
        q = query(q, where('action', '==', filterAction.trim()));
      }
      
      if (loadMore && lastVisible) {
        q = query(q, startAfter(lastVisible), limit(LOGS_PER_PAGE));
      } else {
        q = query(q, limit(LOGS_PER_PAGE));
      }

      const querySnapshot = await getDocs(q);
      const fetchedLogs = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(data.timestamp),
        } as UserActivityLog;
      });
      
      setLogs(prevLogs => loadMore ? [...prevLogs, ...fetchedLogs] : fetchedLogs);
      
      if (querySnapshot.docs.length < LOGS_PER_PAGE) {
        setHasMore(false);
      } else {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }

    } catch (err: any) {
      console.error("Error fetching activity logs:", err);
      setError('Gagal memuat log aktivitas: ' + err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filterUserId, filterAction, lastVisible]); 

  useEffect(() => {
    fetchLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterUserId, filterAction]);

  const handleApplyFilters = () => {
    setLastVisible(null);
    fetchLogs();
  };

  if (loading && logs.length === 0) return <Spinner fullPage={true} />;

  return (
    <div className="page-container">
      <h1 className="page-title mb-6">Log Aktivitas Pengguna</h1>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="content-card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="filterUserId" className="form-label">Filter User ID</label>
            <input
              type="text"
              id="filterUserId"
              placeholder="Masukkan User ID..."
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="filterAction" className="form-label">Filter Aksi</label>
            <input
              type="text"
              id="filterAction"
              placeholder="Contoh: LOGIN_SUCCESS"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="form-input"
            />
          </div>
          <button 
            type="button" 
            onClick={handleApplyFilters} 
            className="btn-primary py-2.5"
            disabled={loading || loadingMore}
          >
            Terapkan Filter
          </button>
        </div>
      </div>

      {loading && logs.length === 0 && <Spinner />}

      {logs.length > 0 && (
        <div className="table-container">
          <table className="table">
            <thead className="table-thead">
              <tr>
                <th className="table-th">Timestamp</th>
                <th className="table-th">User ID</th>
                <th className="table-th">Action</th>
                <th className="table-th">Details</th>
                <th className="table-th">IP Address</th>
                <th className="table-th">User Agent</th>
              </tr>
            </thead>
            <tbody className="table-tbody">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-700/50 transition-colors duration-200">
                  <td className="table-td">
                    <div className="text-sm text-slate-300">
                      {log.timestamp.toLocaleDateString('id-ID')}
                    </div>
                    <div className="text-xs text-slate-500">
                      {log.timestamp.toLocaleTimeString('id-ID')}
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                      {log.userId}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.action.includes('SUCCESS') ? 'bg-emerald-100 text-emerald-800' :
                      log.action.includes('FAILURE') || log.action.includes('ERROR') ? 'bg-red-100 text-red-800' :
                      log.action.includes('LOGIN') ? 'bg-blue-100 text-blue-800' :
                      log.action.includes('LOGOUT') ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="table-td">
                    <div className="max-w-xs">
                      <div className="text-sm text-slate-300 truncate">
                        {log.details ? JSON.stringify(log.details) : '-'}
                      </div>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="text-sm text-slate-400 font-mono">
                      -
                    </span>
                  </td>
                  <td className="table-td">
                    <div className="max-w-xs">
                      <div className="text-xs text-slate-400 truncate">
                        -
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {logs.length === 0 && !loading && (
        <div className="content-card p-8 text-center">
          <div className="text-slate-400 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">Tidak ada log aktivitas</p>
            <p className="text-sm">Coba ubah filter atau tunggu aktivitas baru</p>
          </div>
        </div>
      )}

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => fetchLogs(true)}
            disabled={loadingMore}
            className="btn-secondary"
          >
            {loadingMore ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memuat...
              </>
            ) : (
              'Muat Lebih Banyak'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminActivityLogPage;