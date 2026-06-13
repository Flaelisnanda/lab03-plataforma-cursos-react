import { useState } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { useData } from '../hooks/useData.js';
import { formatDate } from '../utils/validators.js';
import { marcarAulaConcluida, calcularProgressoCurso } from '../services/platformService.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import DataCard from '../components/ui/DataCard.jsx';
import ErrorAlert from '../components/ui/ErrorAlert.jsx';

export default function ProgressoPage() {
  const { matriculas, usuarios, cursos, modulos, aulas, progressoAulas, refresh, showToast } = useData();
  const [idUsuario, setIdUsuario] = useState('');
  const [idCurso, setIdCurso] = useState('');
  const [errors, setErrors] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [pct, setPct] = useState(0);

  const carregar = async () => {
    if (!idUsuario || !idCurso) { setErrors(['Selecione usuário e curso.']); setLoaded(false); return; }
    const mat = matriculas.find(m => Number(m.idUsuario) === Number(idUsuario) && Number(m.idCurso) === Number(idCurso));
    if (!mat) { setErrors(['Usuário não matriculado neste curso.']); setLoaded(false); return; }
    setErrors([]);
    setLoaded(true);
    const progress = await calcularProgressoCurso(Number(idUsuario), Number(idCurso));
    setPct(progress);
  };

  const getAulasCurso = () => {
    const mods = modulos.filter(m => Number(m.idCurso) === Number(idCurso)).sort((a, b) => a.ordem - b.ordem);
    return mods.flatMap(m => aulas.filter(a => Number(a.idModulo) === Number(m.id)).sort((a, b) => a.ordem - b.ordem));
  };

  const concluir = async (idAula) => {
    await marcarAulaConcluida(Number(idUsuario), idAula);
    const progress = await calcularProgressoCurso(Number(idUsuario), Number(idCurso));
    setPct(progress);
    await refresh();
    showToast('Aula concluída!');
  };

  const aulasCurso = loaded ? getAulasCurso() : [];

  return (
    <section>
      <PageHeader title="Progresso" subtitle="Acompanhe e marque conclusão de aulas" />
      <DataCard title="Selecionar Aluno e Curso" Icon={Search}>
        <ErrorAlert errors={errors} />
        <div className="row g-3 align-items-end mb-4">
          <div className="col-md-4">
            <label className="form-label">Usuário</label>
            <select className="form-select" value={idUsuario} onChange={e => { setIdUsuario(e.target.value); setLoaded(false); }}>
              <option value="">Selecione...</option>
              {usuarios?.map(u => <option key={u.id} value={u.id}>{u.nomeCompleto}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Curso</label>
            <select className="form-select" value={idCurso} onChange={e => { setIdCurso(e.target.value); setLoaded(false); }}>
              <option value="">Selecione...</option>
              {cursos?.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100" onClick={carregar}>Carregar Aulas</button>
          </div>
        </div>

        {loaded && (
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Progresso geral</span>
              <strong style={{ color: '#4f46e5' }}>{pct}%</strong>
            </div>
            <div className="progress progress-lg">
              <div className="progress-bar" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {loaded && (
          <div>
            {aulasCurso.length === 0
              ? <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Curso sem aulas cadastradas.</p>
              : aulasCurso.map(aula => {
                  const prog = progressoAulas.find(p => Number(p.idUsuario) === Number(idUsuario) && Number(p.idAula) === Number(aula.id));
                  const done = prog?.status === 'Concluído';
                  return (
                    <div key={aula.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 14px', marginBottom: 6, borderRadius: 8,
                      background: done ? '#f0fdf4' : '#f8fafc',
                      border: `1px solid ${done ? '#bbf7d0' : '#e2e8f0'}`
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: done ? '#166534' : '#0f172a' }}>{aula.titulo}</div>
                        <small style={{ color: '#94a3b8' }}>{aula.tipoConteudo} · {aula.duracaoMinutos} min</small>
                      </div>
                      {done
                        ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#16a34a', fontSize: '0.78rem', fontWeight: 600 }}>
                            <CheckCircle2 size={15} />
                            {formatDate(prog.dataConclusao)}
                          </div>
                        )
                        : <button className="btn btn-sm btn-outline-primary" onClick={() => concluir(aula.id)}>Concluir</button>
                      }
                    </div>
                  );
                })
            }
          </div>
        )}
      </DataCard>
    </section>
  );
}
