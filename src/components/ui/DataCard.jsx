export default function DataCard({ title, Icon, children, action }) {
  return (
    <div className="card data-card border-0">
      <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-4 px-4 pb-3">
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
        {action}
      </div>
      <div className="card-body px-4 pb-4">{children}</div>
    </div>
  );
}
