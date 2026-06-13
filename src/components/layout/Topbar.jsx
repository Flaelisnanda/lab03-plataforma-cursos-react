import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';

const links = [
  { to: '/',          label: 'Dashboard',  end: true },
  { to: '/categorias',label: 'Categorias' },
  { to: '/cursos',    label: 'Cursos' },
  { to: '/usuarios',  label: 'Usuários' },
  { to: '/checkout',  label: 'Checkout' }
];

export default function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="topbar d-lg-none">
      <div className="topbar-inner">
        <div className="topbar-brand">
          <div className="topbar-brand-icon">
            <GraduationCap size={16} color="#fff" />
          </div>
          EduPlatform
        </div>
        <button className="topbar-toggle" onClick={() => setOpen(!open)}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
