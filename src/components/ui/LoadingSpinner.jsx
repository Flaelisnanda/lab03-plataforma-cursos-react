export default function LoadingSpinner({ message = 'Carregando...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
      <div className="spinner-ring" />
      <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>{message}</p>
    </div>
  );
}
