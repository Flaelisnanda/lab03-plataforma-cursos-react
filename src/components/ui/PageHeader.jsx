export default function PageHeader({ title, subtitle, badge }) {
  return (
    <div className="page-header d-flex flex-wrap align-items-center justify-content-between gap-3">
      <div>
        <h2 className="page-title">{title}</h2>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {badge && <span className="page-badge">{badge}</span>}
    </div>
  );
}
