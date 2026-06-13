import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const icons = {
  success: <CheckCircle2 size={17} />,
  danger:  <XCircle size={17} />,
  warning: <AlertCircle size={17} />,
  info:    <Info size={17} />,
};

const typeMap = {
  success: 'success',
  danger:  'error',
  warning: 'warning',
  info:    'info',
};

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const cls = typeMap[toast.type] ?? 'success';

  return (
    <div className="toast-floating">
      <div className={`toast-pill ${cls}`}>
        {icons[toast.type] ?? icons.success}
        <span style={{ flex: 1 }}>{toast.message}</span>
      </div>
    </div>
  );
}
