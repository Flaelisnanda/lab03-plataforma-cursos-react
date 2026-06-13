import { useState } from 'react';
import { Folder, Plus, PlayCircle } from 'lucide-react';
import { useData } from '../hooks/useData.js';
import { Validators } from '../utils/validators.js';
import { createModulo, createAula } from '../services/platformService.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import FormCard from '../components/ui/FormCard.jsx';
import DataCard from '../components/ui/DataCard.jsx';
import ErrorAlert from '../components/ui/ErrorAlert.jsx';

const tipoColor = { Vídeo: '#be123c', Quiz: '#b45309', Texto: '#475569' };

export default function ModulosPage() {
  const { cursos, modulos, aulas, refresh, showToast } = useData();
  const [idCurso, setIdCurso] = useState('');
  const [idModulo, setIdModulo] = useState('');
  const [modForm, setModForm] = useState({ titulo: '', ordem: '' });
  const [aulaForm, setAulaForm] = useState({ titulo: '', tipoConteudo: '', urlConteudo: '', duracaoMinutos: '', ordem: '' });
  const [errorsM, setErrorsM] = useState([]);
  const [errorsA, setErrorsA] = useState([]);

  const mods = idCurso ? modulos.filter(m => Number(m.idCurso) === Number(idCurso)).sort((a, b) => a.ordem - b.ordem) : [];
  const aulasMod = idModulo ? aulas.filter(a => Number(a.idModulo) === Number(idModulo)).sort((a, b) => a.ordem - b.ordem) : [];

  const submitModulo = async (e) => {
    e.preventDefault();
    const data = { idCurso: Number(idCurso), titulo: modForm.titulo.trim(), ordem: Number(modForm.ordem) };
    const errs = Validators.validateFields([
      { value: data.idCurso, label: 'Curso', rules: ['required', 'positive'] },
      { value: data.titulo, label: 'Título', rules: ['required'] },
      { value: data.ordem, label: 'Ordem', rules: ['required', 'positive'] }
    ]);
    setErrorsM(errs);
    if (errs.length) return;
    try {
      await createModulo(data);
      setModForm({ titulo: '', ordem: '' });
      await refresh();
      showToast('Módulo adicionado!');
    } catch (err) { setErrorsM([err.message]); }
  };

  const submitAula = async (e) => {
    e.preventDefault();
    const data = {
      idModulo: Number(idModulo), titulo: aulaForm.titulo.trim(), tipoConteudo: aulaForm.tipoConteudo,
      urlConteudo: aulaForm.urlConteudo.trim(), duracaoMinutos: Number(aulaForm.duracaoMinutos), ordem: Number(aulaForm.ordem)
    };
    const errs = Validators.validateFields([
      { value: data.idModulo, label: 'Módulo', rules: ['required', 'positive'] },
      { value: data.titulo, label: 'Título', rules: ['required'] },
      { value: data.tipoConteudo, label: 'Tipo', rules: ['required'] },
      { value: data.urlConteudo, label: 'URL', rules: ['required'] },
      { value: data.duracaoMinutos, label: 'Duração', rules: ['required', 'positive'] },
      { value: data.ordem, label: 'Ordem', rules: ['required', 'positive'] }
    ]);
    setErrorsA(errs);
    if (errs.length) return;
    try {
      await createAula(data);
      setAulaForm({ titulo: '', tipoConteudo: '', urlConteudo: '', duracaoMinutos: '', ordem: '' });
      await refresh();
      showToast('Aula adicionada!');
    } catch (err) { setErrorsA([err.message]); }
  };

  return (
    <section>
      <PageHeader title="Módulos & Aulas" subtitle="Estruture o conteúdo dos cursos" />
      <div className="row g-4">
        <div className="col-lg-6">
          <DataCard title="Módulos do Curso" Icon={Folder}>
            <select className="form-select mb-3" value={idCurso} onChange={e => { setIdCurso(e.target.value); setIdModulo(''); }}>
              <option value="">Selecione um curso...</option>
              {cursos?.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
            </select>
            <div style={{ marginBottom: 16 }}>
              {mods.map(m => (
                <div key={m.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: '1px solid #f1f5f9'
                }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#4f46e5', marginRight: 6 }}>#{m.ordem}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.titulo}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.78rem', marginLeft: 6 }}>
                      ({aulas.filter(a => Number(a.idModulo) === Number(m.id)).length} aulas)
                    </span>
                  </div>
                  <span style={{ background: '#eef2ff', color: '#4f46e5', borderRadius: 6, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 600 }}>ID {m.id}</span>
                </div>
              ))}
            </div>
            <FormCard title="Novo Módulo" Icon={Plus}>
              <ErrorAlert errors={errorsM} />
              <form onSubmit={submitModulo}>
                <div className="mb-3"><label className="form-label">Título *</label>
                  <input className="form-control" value={modForm.titulo} onChange={e => setModForm({ ...modForm, titulo: e.target.value })} /></div>
                <div className="mb-3"><label className="form-label">Ordem *</label>
                  <input type="number" min="1" className="form-control" value={modForm.ordem} onChange={e => setModForm({ ...modForm, ordem: e.target.value })} /></div>
                <button type="submit" className="btn btn-primary w-100" disabled={!idCurso}>Adicionar Módulo</button>
              </form>
            </FormCard>
          </DataCard>
        </div>
        <div className="col-lg-6">
          <DataCard title="Aulas do Módulo" Icon={PlayCircle}>
            <select className="form-select mb-3" value={idModulo} onChange={e => setIdModulo(e.target.value)} disabled={!idCurso}>
              <option value="">Selecione um módulo...</option>
              {mods.map(m => <option key={m.id} value={m.id}>#{m.ordem} - {m.titulo}</option>)}
            </select>
            <div style={{ marginBottom: 16 }}>
              {aulasMod.map(a => (
                <div key={a.id} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>#{a.ordem} {a.titulo}</span>
                    <span style={{
                      background: (tipoColor[a.tipoConteudo] ?? '#475569') + '18',
                      color: tipoColor[a.tipoConteudo] ?? '#475569',
                      borderRadius: 99, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700
                    }}>{a.tipoConteudo}</span>
                  </div>
                  <small style={{ color: '#94a3b8' }}>{a.duracaoMinutos} min</small>
                </div>
              ))}
            </div>
            <FormCard title="Nova Aula" Icon={Plus}>
              <ErrorAlert errors={errorsA} />
              <form onSubmit={submitAula}>
                <div className="mb-3"><label className="form-label">Título *</label>
                  <input className="form-control" value={aulaForm.titulo} onChange={e => setAulaForm({ ...aulaForm, titulo: e.target.value })} /></div>
                <div className="mb-3"><label className="form-label">Tipo *</label>
                  <select className="form-select" value={aulaForm.tipoConteudo} onChange={e => setAulaForm({ ...aulaForm, tipoConteudo: e.target.value })}>
                    <option value="">Selecione...</option><option>Vídeo</option><option>Texto</option><option>Quiz</option>
                  </select></div>
                <div className="mb-3"><label className="form-label">URL *</label>
                  <input type="url" className="form-control" placeholder="https://..." value={aulaForm.urlConteudo} onChange={e => setAulaForm({ ...aulaForm, urlConteudo: e.target.value })} /></div>
                <div className="row">
                  <div className="col-6 mb-3"><label className="form-label">Min *</label>
                    <input type="number" min="1" className="form-control" value={aulaForm.duracaoMinutos} onChange={e => setAulaForm({ ...aulaForm, duracaoMinutos: e.target.value })} /></div>
                  <div className="col-6 mb-3"><label className="form-label">Ordem *</label>
                    <input type="number" min="1" className="form-control" value={aulaForm.ordem} onChange={e => setAulaForm({ ...aulaForm, ordem: e.target.value })} /></div>
                </div>
                <button type="submit" className="btn btn-success w-100" disabled={!idModulo}>Adicionar Aula</button>
              </form>
            </FormCard>
          </DataCard>
        </div>
      </div>
    </section>
  );
}
