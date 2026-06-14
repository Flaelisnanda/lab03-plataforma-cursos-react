import { useState } from 'react';
import { PlusCircle, Link2, List, GitBranch } from 'lucide-react';
import { useData, findById } from '../hooks/useData.js';
import { Validators } from '../utils/validators.js';
import { createTrilha, addCursoATrilha } from '../services/platformService.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import FormCard from '../components/ui/FormCard.jsx';
import DataCard from '../components/ui/DataCard.jsx';
import ErrorAlert from '../components/ui/ErrorAlert.jsx';

export default function TrilhasPage() {
  const { trilhas, trilhasCursos, cursos, categorias, refresh, showToast } = useData();
  const [trilhaForm, setTrilhaForm] = useState({ titulo: '', descricao: '', idCategoria: '' });
  const [cursoForm, setCursoForm] = useState({ idTrilha: '', idCurso: '', ordem: '' });
  const [filtro, setFiltro] = useState('');
  const [errorsT, setErrorsT] = useState([]);
  const [errorsC, setErrorsC] = useState([]);

  const getCursosTrilha = (idTrilha) =>
    trilhasCursos.filter(tc => Number(tc.idTrilha) === Number(idTrilha)).sort((a, b) => a.ordem - b.ordem)
      .map(tc => ({ ...findById(cursos, tc.idCurso), ordem: tc.ordem })).filter(c => c.id);

  const submitTrilha = async (e) => {
    e.preventDefault();
    const errs = Validators.validateFields([
      { value: trilhaForm.titulo, label: 'Título', rules: ['required'] },
      { value: trilhaForm.descricao, label: 'Descrição', rules: ['required'] },
      { value: trilhaForm.idCategoria, label: 'Categoria', rules: ['required'] }
    ]);
    setErrorsT(errs);
    if (errs.length) return;
    try {
      await createTrilha({ titulo: trilhaForm.titulo.trim(), descricao: trilhaForm.descricao.trim(), idCategoria: Number(trilhaForm.idCategoria) });
      setTrilhaForm({ titulo: '', descricao: '', idCategoria: '' });
      await refresh();
      showToast('Trilha cadastrada!');
    } catch (err) { setErrorsT([err.message]); }
  };

  const submitCurso = async (e) => {
    e.preventDefault();
    const errs = Validators.validateFields([
      { value: cursoForm.idTrilha, label: 'Trilha', rules: ['required'] },
      { value: cursoForm.idCurso, label: 'Curso', rules: ['required'] },
      { value: cursoForm.ordem, label: 'Ordem', rules: ['required', 'positive'] }
    ]);
    setErrorsC(errs);
    if (errs.length) return;
    try {
      await addCursoATrilha(Number(cursoForm.idTrilha), Number(cursoForm.idCurso), Number(cursoForm.ordem));
      setCursoForm({ idTrilha: '', idCurso: '', ordem: '' });
      await refresh();
      showToast('Curso adicionado à trilha!');
    } catch (err) { setErrorsC([err.message]); }
  };

  const cursosTrilha = filtro ? getCursosTrilha(Number(filtro)) : [];

  return (
    <section>
      <PageHeader title="Trilhas de Conhecimento" subtitle="Organize sequências de cursos por área" />
      <div className="row g-4">
        <div className="col-lg-4">
          <FormCard title="Nova Trilha" Icon={PlusCircle}>
            <ErrorAlert errors={errorsT} />
            <form onSubmit={submitTrilha}>
              <div className="mb-3"><label className="form-label">Título *</label>
                <input className="form-control" value={trilhaForm.titulo} onChange={e => setTrilhaForm({ ...trilhaForm, titulo: e.target.value })} /></div>
              <div className="mb-3"><label className="form-label">Descrição *</label>
                <textarea className="form-control" rows={2} value={trilhaForm.descricao} onChange={e => setTrilhaForm({ ...trilhaForm, descricao: e.target.value })} /></div>
              <div className="mb-3"><label className="form-label">Categoria *</label>
                <select className="form-select" value={trilhaForm.idCategoria} onChange={e => setTrilhaForm({ ...trilhaForm, idCategoria: e.target.value })}>
                  <option value="">Selecione...</option>
                  {categorias?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select></div>
              <button type="submit" className="btn btn-primary w-100">Cadastrar Trilha</button>
            </form>
          </FormCard>
          <div className="mt-3">
            <FormCard title="Adicionar Curso à Trilha" Icon={Link2}>
              <ErrorAlert errors={errorsC} />
              <form onSubmit={submitCurso}>
                <div className="mb-3"><label className="form-label">Trilha *</label>
                  <select className="form-select" value={cursoForm.idTrilha} onChange={e => setCursoForm({ ...cursoForm, idTrilha: e.target.value })}>
                    <option value="">Selecione...</option>
                    {trilhas?.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)}
                  </select></div>
                <div className="mb-3"><label className="form-label">Curso *</label>
                  <select className="form-select" value={cursoForm.idCurso} onChange={e => setCursoForm({ ...cursoForm, idCurso: e.target.value })}>
                    <option value="">Selecione...</option>
                    {cursos?.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                  </select></div>
                <div className="mb-3"><label className="form-label">Ordem *</label>
                  <input type="number" min="1" className="form-control" value={cursoForm.ordem} onChange={e => setCursoForm({ ...cursoForm, ordem: e.target.value })} /></div>
                <button type="submit" className="btn btn-success w-100">Adicionar</button>
              </form>
            </FormCard>
          </div>
        </div>
        <div className="col-lg-8">
          <DataCard title="Trilhas Cadastradas" Icon={List}>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead><tr><th>ID</th><th>Título</th><th>Categoria</th><th>Cursos</th></tr></thead>
                <tbody>
                  {trilhas?.map(t => (
                    <tr key={t.id}>
                      <td style={{ color: '#94a3b8' }}>#{t.id}</td>
                      <td className="fw-medium">{t.titulo}</td>
                      <td style={{ color: '#64748b' }}>{findById(categorias, t.idCategoria)?.nome}</td>
                      <td>
                        <span style={{ background: '#eef2ff', color: '#4f46e5', borderRadius: 99, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {getCursosTrilha(t.id).length}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataCard>
          <div className="mt-3">
            <DataCard
              title="Cursos da Trilha"
              Icon={GitBranch}
              action={
                <select className="form-select form-select-sm w-auto" value={filtro} onChange={e => setFiltro(e.target.value)}>
                  <option value="">Selecione...</option>
                  {trilhas?.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)}
                </select>
              }
            >
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead><tr><th>Ordem</th><th>Curso</th><th>Nível</th></tr></thead>
                  <tbody>
                    {cursosTrilha.length ? cursosTrilha.map(c => (
                      <tr key={c.id}>
                        <td><span style={{ background: '#0f172a', color: '#f1f5f9', borderRadius: 6, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700 }}>{c.ordem}</span></td>
                        <td>{c.titulo}</td>
                        <td style={{ color: '#64748b' }}>{c.nivel}</td>
                      </tr>
                    )) : <tr><td colSpan="3" style={{ color: '#94a3b8', textAlign: 'center', padding: '28px 0' }}>Selecione uma trilha</td></tr>}
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
