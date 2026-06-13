const colorMap = {
  primary: { bg: '#eef2ff', text: '#4f46e5', bar: '#4f46e5' },
  success: { bg: '#d1fae5', text: '#059669', bar: '#059669' },
  info:    { bg: '#e0f2fe', text: '#0284c7', bar: '#0284c7' },
  warning: { bg: '#fef3c7', text: '#b45309', bar: '#b45309' },
};

export default function StatCard({ label, value, Icon, color = 'primary' }) {
  const c = colorMap[color] ?? colorMap.primary;
  return (
    <div className="card stat-card h-100">
      <div className="card-body d-flex align-items-center gap-3 p-4">
        <div className="flex-grow-1">
          <div className="stat-value" style={{ color: c.text }}>{value}</div>
          <div className="stat-label mt-1">{label}</div>
        </div>
        {Icon && (
          <div className="stat-icon-wrap" style={{ background: c.bg }}>
            <Icon size={22} color={c.text} />
          </div>
        )}
      </div>
      <div style={{ height: 3, background: c.bar, borderRadius: '0 0 14px 14px' }} />
    </div>
  );
}
