import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { fetchAllData } from '../services/platformService.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchAllData();
      setData(result);
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados da API.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const value = useMemo(() => ({
    data, loading, error, refresh, loadData, showToast, toast
  }), [data, loading, error, refresh, loadData, showToast, toast]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}
