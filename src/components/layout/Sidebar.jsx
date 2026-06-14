import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Tag, BookOpen, Route, Layers,
  UserPlus, UserCheck, TrendingUp, Award,
  CreditCard, ShoppingCart, GraduationCap
} from 'lucide-react';

const menu = [
  { to: '/', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { section: 'Acadêmico' },
  { to: '/categorias',  label: 'Categorias',      Icon: Tag },
  { to: '/cursos',      label: 'Cursos',           Icon: BookOpen },
  { to: '/trilhas',     label: 'Trilhas',          Icon: Route },
  { to: '/modulos',     label: 'Módulos & Aulas',  Icon: Layers },
  { section: 'Usuários' },
  { to: '/usuarios',    label: 'Cadastro',         Icon: UserPlus },
  { to: '/matriculas',  label: 'Matrículas',       Icon: UserCheck },
  { to: '/progresso',   label: 'Progresso',        Icon: TrendingUp },
  { to: '/certificados',label: 'Certificados',     Icon: Award },
  { section: 'Financeiro' },
  { to: '/planos',      label: 'Planos',           Icon: CreditCard },
  { to: '/checkout',    label: 'Checkout',         Icon: ShoppingCart }
];

export default function Sidebar() {
  return (
    <aside className="sidebar d-none d-lg-flex flex-column">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap size={20} color="#fff" />
        </div>
        <div>
          <span className="brand-name">LearnHub</span>
        </div>
      </div>

      <div className="sidebar-scroll">
        {menu.map((item, i) =>
          item.section ? (
            <div key={i} className="sidebar-section">{item.section}</div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <item.Icon size={16} className="sidebar-link-icon" />
              <span>{item.label}</span>
            </NavLink>
          )
        )}
      </div>

    </aside>
  );
}
