import { useState } from 'react';
import { Tag, PlusCircle, List, Filter } from 'lucide-react';
import { useData, countBy, findById } from '../hooks/useData.js';
import { Validators } from '../utils/validators.js';
import { createCategoria } from '../services/platformService.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import FormCard from '../components/ui/FormCard.jsx';
import DataCard from '../components/ui/DataCard.jsx';
import ErrorAlert from '../components/ui/ErrorAlert.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function CategoriasPage() {
  const { categorias, cursos, refresh, showToast } = useData();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [filtro, setFiltro] = useState('');
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = Validators.validateFields([
      { value: nome, label: 'Nome', rules: ['required'] },
      { value: descricao, label: 'Descrição', rules: ['required'] }
    ]);
    if (categorias.some(c => c.nome.toLowerCase() === nome.trim().toLowerCase())) {
      errs.push('Já existe uma categoria com este nome.');
    }
    setErrors(errs);
    if (errs.length) return;

    setSubmitting(true);
    try {
      await createCategoria({ nome: nome.trim(), descricao: descricao.trim() });
      setNome(''); setDescricao('');
      await refresh();
      showToast('Categoria cadastrada com sucesso!');
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setSubmitting(false);
    }
  };

  const cursosFiltrados = filtro ? cursos.filter(c => Number(c.idCategoria) === Number(filtro)) : cursos;

  return (
    <section>
      <PageHeader title="Categorias" subtitle="Organize o catálogo de cursos por área de conhecimento" />
      <div className="row g-4">
        <div className="col-lg-4">
          <FormCard title="Nova Categoria" Icon={PlusCircle}>
            <ErrorAlert errors={errors} />
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nome *</label>
                <input className="form-control form-control-lg" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Programação" />
              </div>
              <div className="mb-3">
                <label className="form-label">Descrição *</label>
                <textarea className="form-control" rows={3} value={descricao} onChange={e => setDescricao(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Cadastrar Categoria'}
              </button>
            </form>
          </FormCard>
        </div>
        <div className="col-lg-8">
          <DataCard title="Categorias Cadastradas" Icon={List}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead><tr><th>ID</th><th>Nome</th><th>Descrição</th><th>Cursos</th></tr></thead>
                <tbody>
                  {categorias?.length ? categorias.map(c => (
                    <tr key={c.id}>
                      <td><span className="badge bg-light text-dark">#{c.id}</span></td>
                      <td className="fw-medium">{c.nome}</td>
                      <td style={{ color: '#64748b' }}>{c.descricao}</td>
                      <td>
                        <span style={{ background: '#eef2ff', color: '#4f46e5', borderRadius: 99, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {countBy(cursos, 'idCategoria', c.id)}
                        </span>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="4"><EmptyState message="Nenhuma categoria cadastrada." /></td></tr>}
                </tbody>
              </table>
            </div>
          </DataCard>
          <div className="mt-3">
            <DataCard
              title={filtro ? `Cursos: ${findById(categorias, filtro)?.nome}` : 'Todos os Cursos'}
              Icon={Filter}
              action={
                <select className="form-select form-select-sm w-auto" value={filtro} onChange={e => setFiltro(e.target.value)}>
                  <option value="">Todas</option>
                  {categorias?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              }
            >
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead><tr><th>Título</th><th>Categoria</th><th>Nível</th><th>Aulas</th></tr></thead>
                  <tbody>
                    {cursosFiltrados?.map(c => (
                      <tr key={c.id}>
                        <td>{c.titulo}</td>
                        <td>{findById(categorias, c.idCategoria)?.nome}</td>
                        <td><span className="badge bg-secondary">{c.nivel}</span></td>
                        <td>{c.totalAulas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DataCard>
          </div>
        </div>
      </div>
    </section>
  );
}
