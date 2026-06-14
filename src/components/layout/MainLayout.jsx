import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import Toast from '../ui/Toast.jsx';

export default function MainLayout() {
  const { loading, error, loadData, refresh } = useApp();

  useEffect(() => { loadData(); }, [loadData]);

  if (loading && !error) {
    return (
      <div className="loading-screen">
        <div className="spinner-ring" />
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
          Conectando à API…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 16,
          padding: '40px 48px',
          maxWidth: 440,
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(15,23,42,0.08)'
        }}>
          <div style={{
            width: 56, height: 56, background: '#fff1f2',
            borderRadius: 14, display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 20px'
          }}>
            <WifiOff size={26} color="#e11d48" />
          </div>
          <h4 style={{ fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>API indisponível</h4>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 6 }}>{error}</p>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: 24 }}>
            Execute: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>npm run server</code>
          </p>
          <button
            onClick={refresh}
            style={{
              background: '#4f46e5', color: '#fff', border: 'none',
              borderRadius: 8, padding: '10px 24px', fontWeight: 600,
              fontSize: '0.875rem', cursor: 'pointer', display: 'inline-flex',
              alignItems: 'center', gap: 8
            }}
          >
            <RefreshCw size={15} />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  );
}
