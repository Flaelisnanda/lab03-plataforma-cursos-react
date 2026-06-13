export default function FormCard({ title, Icon, children }) {
  return (
    <div className="card form-card border-0 h-100">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-3">
        <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2" style={{ color: '#0f172a', fontSize: '0.95rem' }}>
          {Icon && (
            <span style={{
              width: 30, height: 30, background: '#eef2ff',
              borderRadius: 8, display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <Icon size={15} color="#4f46e5" />
            </span>
          )}
          {title}
        </h5>
      </div>
      <div className="card-body px-4 pb-4">{children}</div>
    </div>
  );
}
