import { Link } from 'react-router-dom';
import {
  Users, BookOpen, UserCheck, Award,
  Zap, PieChart, Tag, CreditCard, GraduationCap,
  ArrowRight, ChevronRight
} from 'lucide-react';
import { useData } from '../hooks/useData.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import StatCard from '../components/ui/StatCard.jsx';

const quickLinks = [
  { to: '/categorias', label: 'Cadastrar Categoria',      Icon: Tag },
  { to: '/modulos',    label: 'Adicionar Módulos e Aulas', Icon: BookOpen },
  { to: '/matriculas', label: 'Realizar Matrícula',        Icon: UserCheck },
  { to: '/checkout',   label: 'Simular Pagamento',         Icon: CreditCard },
];

export default function DashboardPage() {
  const { usuarios, cursos, matriculas, certificados, planos, categorias } = useData();

  return (
    <section>
      {/* Hero */}
      <div className="hero-banner p-4 p-md-5 mb-4 text-white" style={{ position: 'relative', zIndex: 0 }}>
        <div className="row align-items-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="col-lg-8">
            <span style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              borderRadius: 99,
              padding: '4px 14px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 16
            }}>
              Plataforma de Cursos Online
            </span>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', letterSpacing: '-0.03em', marginBottom: 12 }}>
              Bem-vindo à LearnHub
            </h1>
            <p style={{ opacity: 0.85, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 28, maxWidth: 480 }}>
              Gerencie cursos, matrículas, progresso e assinaturas — tudo em um só lugar.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/cursos" className="btn btn-light btn-sm px-4" style={{ fontWeight: 600 }}>
                Ver Cursos
              </Link>
              <Link to="/usuarios" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 6, padding: '6px 18px', fontSize: '0.875rem',
                fontWeight: 600, color: '#fff', textDecoration: 'none',
                backdropFilter: 'blur(4px)', transition: 'background 0.15s'
              }}>
                Cadastrar Usuário
              </Link>
            </div>
          </div>
          <div className="col-lg-4 d-none d-lg-flex justify-content-end align-items-center">
            <GraduationCap size={96} color="rgba(255,255,255,0.18)" />
          </div>
        </div>
      </div>

      <PageHeader title="Visão Geral" subtitle="Resumo das atividades da plataforma" badge="API Online" />

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard label="Usuários"    value={usuarios?.length    ?? 0} Icon={Users}     color="primary" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard label="Cursos"      value={cursos?.length      ?? 0} Icon={BookOpen}  color="success" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard label="Matrículas"  value={matriculas?.length  ?? 0} Icon={UserCheck} color="info" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard label="Certificados" value={certificados?.length ?? 0} Icon={Award}  color="warning" />
        </div>
      </div>

      {/* Quick links + catalog */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card h-100 border-0">
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                <span style={{ width: 28, height: 28, background: '#eef2ff', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={14} color="#4f46e5" />
                </span>
                Acesso Rápido
              </h5>
              {quickLinks.map(({ to, label, Icon }) => (
                <Link key={to} to={to} className="quick-link">
                  <div className="quick-link-icon">
                    <Icon size={14} />
                  </div>
                  <span style={{ flex: 1 }}>{label}</span>
                  <ChevronRight size={14} color="#94a3b8" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 border-0">
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                <span style={{ width: 28, height: 28, background: '#d1fae5', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PieChart size={14} color="#059669" />
                </span>
                Resumo do Catálogo
              </h5>
              <div className="catalog-row">
                <span>Categorias</span>
                <strong>{categorias?.length ?? 0}</strong>
              </div>
              <div className="catalog-row">
                <span>Planos ativos</span>
                <strong>{planos?.length ?? 0}</strong>
              </div>
              <div className="catalog-row">
                <span>Cursos publicados</span>
                <strong>{cursos?.length ?? 0}</strong>
              </div>
              <div className="catalog-row">
                <span>Certificados emitidos</span>
                <strong>{certificados?.length ?? 0}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
