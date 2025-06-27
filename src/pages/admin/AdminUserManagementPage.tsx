import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy, startAfter, limit, DocumentData, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { db, auth } from '@/config/firebase'; 
import { useAuth } from '@/hooks/useAuth';
import { User, UserRole } from '@/types';
import Spinner from '@/components/Spinner';
import { logUserActivity } from '@/utils/activityLogger'; 
import { APP_ROUTES } from '@/constants';

const USERS_PER_PAGE = 10;

const AdminUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | ''>('');
  
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchUsers = useCallback(async (loadMore = false) => {
    if (!loadMore) {
      setLoading(true);
      setUsers([]);
      setLastVisible(null);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      let q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));

      if (filterRole) {
        q = query(q, where('role', '==', filterRole));
      }
      
      if (loadMore && lastVisible) {
        q = query(q, startAfter(lastVisible), limit(USERS_PER_PAGE));
      } else {
        q = query(q, limit(USERS_PER_PAGE));
      }

      const querySnapshot = await getDocs(q);
      const fetchedUsers = querySnapshot.docs.map(docSnap => ({
        uid: docSnap.id,
        ...docSnap.data(),
      } as User));
      
      setUsers(prevUsers => loadMore ? [...prevUsers, ...fetchedUsers] : fetchedUsers);
      
      if (querySnapshot.docs.length < USERS_PER_PAGE) {
        setHasMore(false);
      } else {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }

    } catch (err) {
      console.error("Error fetching users:", err);
      setError('Gagal memuat daftar pengguna.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filterRole, lastVisible]); 

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRole]); 

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    const originalUser = users.find(u => u.uid === userId);
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, updates);
      setUsers(prevUsers =>
        prevUsers.map(user => (user.uid === userId ? { ...user, ...updates } : user))
      );
      
      if (updates.role && updates.role !== originalUser?.role) {
        await logUserActivity(auth, db, 'ADMIN_USER_ROLE_CHANGE', { targetUserId: userId, oldRole: originalUser?.role, newRole: updates.role });
      }
      if (updates.status && updates.status !== originalUser?.status) {
         await logUserActivity(auth, db, 'ADMIN_USER_STATUS_CHANGE', { targetUserId: userId, oldStatus: originalUser?.status, newStatus: updates.status });
      }

      setEditingUser(null);
    } catch (err: any) {
      console.error("Error updating user:", err);
      setError('Gagal memperbarui pengguna.');
      await logUserActivity(auth, db, 'ADMIN_USER_UPDATE_FAILURE', { targetUserId: userId, updates, error: err.message });
    }
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    handleUpdateUser(userId, { role: newRole });
  };

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive') => {
    handleUpdateUser(userId, { status: newStatus });
  };

  const handleSoftDeleteUser = (userId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menonaktifkan pengguna ini? Mereka tidak akan bisa login.')) {
      handleUpdateUser(userId, { status: 'inactive' });
    }
  };
  
  const displayedUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = user.displayName?.toLowerCase().includes(searchLower);
    const emailMatch = user.email?.toLowerCase().includes(searchLower);
    return nameMatch || emailMatch;
  });

  if (loading && users.length === 0) return <Spinner fullPage={true} />;

  return (
    <div className="page-container">
      <h1 className="page-title mb-6">Manajemen Pengguna</h1>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="content-card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="search-users" className="form-label">Cari Pengguna</label>
            <input
              type="text"
              id="search-users"
              placeholder="Cari berdasarkan nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="filter-role" className="form-label">Filter Peran</label>
            <select
              id="filter-role"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | '')}
              className="form-select"
            >
              <option value="">Semua Peran</option>
              {Object.values(UserRole).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <button 
            type="button" 
            onClick={() => setSearchTerm('')} 
            className="btn-secondary py-2.5"
            disabled={loading}
          >
            Reset Filter
          </button>
        </div>
      </div>

      {loading && users.length === 0 && <Spinner />}

      {displayedUsers.length === 0 && !loading && (
         <div className="content-card text-center py-10">
          <div className="text-slate-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="section-title mb-2">Tidak ada pengguna yang ditemukan</p>
          <p className="text-secondary">Coba ubah filter atau kata kunci pencarian Anda.</p>
        </div>
      )}

      {displayedUsers.length > 0 && (
        <div className="table-container">
          <table className="table">
            <thead className="table-thead">
              <tr>
                <th className="table-th">Pengguna</th>
                <th className="table-th">Email</th>
                <th className="table-th">Peran</th>
                <th className="table-th">Status</th>
                <th className="table-th">Terdaftar</th>
                <th className="table-th">Aksi</th>
              </tr>
            </thead>
            <tbody className="table-tbody">
              {displayedUsers.map((user) => (
                <tr key={user.uid} className="hover:bg-slate-700/50 transition-colors duration-200">
                  <td className="table-td">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-slate-300">
                          {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">
                          {user.displayName || 'Nama tidak tersedia'}
                        </div>
                        <div className="text-sm text-slate-400">
                          ID: {user.uid.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="text-slate-300">{user.email || 'Email tidak tersedia'}</span>
                  </td>
                  <td className="table-td">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === UserRole.ADMIN ? 'bg-red-100 text-red-800' :
                      user.role === UserRole.COMPANY ? 'bg-blue-100 text-blue-800' :
                      user.role === UserRole.TRAINING_PROVIDER ? 'bg-purple-100 text-purple-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="table-td">
                    <div className="text-sm text-slate-300">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : 'N/A'}
                    </div>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center space-x-2">
                      {editingUser?.uid === user.uid ? (
                        <>
                          <select
                            value={editingUser.role}
                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                            className="form-select text-xs py-1"
                            aria-label="Ubah peran pengguna"
                          >
                            {Object.values(UserRole).map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                          <select
                            value={editingUser.status}
                            onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as 'active' | 'inactive' })}
                            className="form-select text-xs py-1"
                            aria-label="Ubah status pengguna"
                          >
                            <option value="active">Aktif</option>
                            <option value="inactive">Tidak Aktif</option>
                          </select>
                          <button
                            onClick={() => handleUpdateUser(user.uid, { role: editingUser.role, status: editingUser.status })}
                            className="btn-primary text-xs py-1 px-2"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="btn-secondary text-xs py-1 px-2"
                          >
                            Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingUser(user)}
                            className="btn-secondary text-xs py-1 px-2"
                          >
                            Edit
                          </button>
                          {user.status === 'active' && (
                            <button
                              onClick={() => handleSoftDeleteUser(user.uid)}
                              className="btn-danger text-xs py-1 px-2"
                            >
                              Nonaktifkan
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {hasMore && !loading && displayedUsers.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => fetchUsers(true)}
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

export default AdminUserManagementPage;