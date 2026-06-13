import { useState } from 'react';
import { PlusCircle, LayoutGrid, User } from 'lucide-react';
import { useData, findById } from '../hooks/useData.js';
import { Validators, formatDate } from '../utils/validators.js';
import { createCurso } from '../services/platformService.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import FormCard from '../components/ui/FormCard.jsx';
import DataCard from '../components/ui/DataCard.jsx';
import ErrorAlert from '../components/ui/ErrorAlert.jsx';

const levelColors = { Iniciante: '#059669', Intermediário: '#b45309', Avançado: '#be123c' };

export default function CursosPage() {
  const { cursos, usuarios, categorias, refresh, showToast } = useData();
  const [form, setForm] = useState({ titulo: '', descricao: '', idInstrutor: '', idCategoria: '', nivel: '', dataPublicacao: '' });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      titulo: form.titulo.trim(), descricao: form.descricao.trim(),
      idInstrutor: Number(form.idInstrutor), idCategoria: Number(form.idCategoria),
      nivel: form.nivel, dataPublicacao: form.dataPublicacao
    };
    const errs = Validators.validateFields([
      { value: data.titulo, label: 'Título', rules: ['required'] },
      { value: data.descricao, label: 'Descrição', rules: ['required'] },
      { value: data.idInstrutor, label: 'Instrutor', rules: ['required', 'positive'] },
      { value: data.idCategoria, label: 'Categoria', rules: ['required', 'positive'] },
      { value: data.nivel, label: 'Nível', rules: ['required'] },
      { value: data.dataPublicacao, label: 'Data', rules: ['required', 'date'] }
    ]);
    setErrors(errs);
    if (errs.length) return;

    setSubmitting(true);
    try {
      await createCurso(data);
      setForm({ titulo: '', descricao: '', idInstrutor: '', idCategoria: '', nivel: '', dataPublicacao: '' });
      await refresh();
      showToast('Curso cadastrado!');
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <PageHeader title="Cursos" subtitle="Cadastre e gerencie o catálogo de cursos" />
      <div className="row g-4">
        <div className="col-lg-4">
          <FormCard title="Novo Curso" Icon={PlusCircle}>
            <ErrorAlert errors={errors} />
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Título *</label>
                <input className="form-control" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Descrição *</label>
                <textarea className="form-control" rows={2} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Instrutor *</label>
                <select className="form-select" value={form.idInstrutor} onChange={e => setForm({ ...form, idInstrutor: e.target.value })}>
                  <option value="">Selecione...</option>
                  {usuarios?.map(u => <option key={u.id} value={u.id}>{u.nomeCompleto}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Categoria *</label>
                <select className="form-select" value={form.idCategoria} onChange={e => setForm({ ...form, idCategoria: e.target.value })}>
                  <option value="">Selecione...</option>
                  {categorias?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Nível *</label>
                <select className="form-select" value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value })}>
                  <option value="">Selecione...</option>
                  <option>Iniciante</option><option>Intermediário</option><option>Avançado</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Data de Publicação *</label>
                <input type="date" className="form-control" value={form.dataPublicacao} onChange={e => setForm({ ...form, dataPublicacao: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={submitting}>{submitting ? 'Salvando...' : 'Cadastrar Curso'}</button>
            </form>
          </FormCard>
        </div>
        <div className="col-lg-8">
          <DataCard title="Catálogo de Cursos" Icon={LayoutGrid}>
            <div className="row g-3 mb-4">
              {cursos?.map(c => (
                <div key={c.id} className="col-md-6">
                  <div className="card course-card h-100" style={{ background: '#f8fafc' }}>
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span style={{
                          background: levelColors[c.nivel] ? levelColors[c.nivel] + '18' : '#e2e8f0',
                          color: levelColors[c.nivel] ?? '#475569',
                          borderRadius: 99, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700
                        }}>{c.nivel}</span>
                        <small style={{ color: '#94a3b8' }}>{c.totalAulas} aulas · {c.totalHoras}h</small>
                      </div>
                      <h6 className="fw-bold mb-1" style={{ fontSize: '0.875rem' }}>{c.titulo}</h6>
                      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: 8 }}>{c.descricao}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', fontSize: '0.78rem' }}>
                        <User size={12} />
                        <span>{findById(usuarios, c.idInstrutor)?.nomeCompleto}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead><tr><th>ID</th><th>Título</th><th>Categoria</th><th>Instrutor</th><th>Nível</th><th>Aulas</th></tr></thead>
                <tbody>
                  {cursos?.map(c => (
                    <tr key={c.id}>
                      <td style={{ color: '#94a3b8' }}>#{c.id}</td>
                      <td className="fw-medium">{c.titulo}</td>
                      <td style={{ color: '#64748b' }}>{findById(categorias, c.idCategoria)?.nome}</td>
                      <td style={{ color: '#64748b' }}>{findById(usuarios, c.idInstrutor)?.nomeCompleto}</td>
                      <td><span style={{
                        background: levelColors[c.nivel] ? levelColors[c.nivel] + '18' : '#e2e8f0',
                        color: levelColors[c.nivel] ?? '#475569',
                        borderRadius: 99, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700
                      }}>{c.nivel}</span></td>
                      <td>{c.totalAulas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataCard>
        </div>
      </div>
    </section>
  );
}
