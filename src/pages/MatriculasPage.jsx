import { useState, useEffect } from 'react';
import { UserPlus, TableProperties } from 'lucide-react';
import { useData, findById } from '../hooks/useData.js';
import { Validators, formatDate } from '../utils/validators.js';
import { createMatricula, calcularProgressoCurso } from '../services/platformService.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import FormCard from '../components/ui/FormCard.jsx';
import DataCard from '../components/ui/DataCard.jsx';
import ErrorAlert from '../components/ui/ErrorAlert.jsx';

export default function MatriculasPage() {
  const { matriculas, usuarios, cursos, refresh, showToast } = useData();
  const [form, setForm] = useState({ idUsuario: '', idCurso: '', dataMatricula: '' });
  const [errors, setErrors] = useState([]);
  const [progressos, setProgressos] = useState({});

  useEffect(() => {
    if (!matriculas?.length) return;
    Promise.all(matriculas.map(async m => {
      const pct = await calcularProgressoCurso(m.idUsuario, m.idCurso);
      return [m.id, pct];
    })).then(results => setProgressos(Object.fromEntries(results)));
  }, [matriculas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      idUsuario: Number(form.idUsuario), idCurso: Number(form.idCurso),
      dataMatricula: form.dataMatricula || new Date().toISOString().split('T')[0]
    };
    const errs = Validators.validateFields([
      { value: data.idUsuario, label: 'Usuário', rules: ['required', 'positive'] },
      { value: data.idCurso, label: 'Curso', rules: ['required', 'positive'] },
      { value: data.dataMatricula, label: 'Data', rules: ['required', 'date'] }
    ]);
    setErrors(errs);
    if (errs.length) return;
    try {
      await createMatricula(data);
      setForm({ idUsuario: '', idCurso: '', dataMatricula: '' });
      await refresh();
      showToast('Matrícula realizada!');
    } catch (err) { setErrors([err.message]); }
  };

  return (
    <section>
      <PageHeader title="Matrículas" subtitle="Inscreva alunos nos cursos" />
      <div className="row g-4">
        <div className="col-lg-4">
          <FormCard title="Nova Matrícula" Icon={UserPlus}>
            <ErrorAlert errors={errors} />
            <form onSubmit={handleSubmit}>
              <div className="mb-3"><label className="form-label">Usuário *</label>
                <select className="form-select" value={form.idUsuario} onChange={e => setForm({ ...form, idUsuario: e.target.value })}>
                  <option value="">Selecione...</option>
                  {usuarios?.map(u => <option key={u.id} value={u.id}>{u.nomeCompleto}</option>)}
                </select></div>
              <div className="mb-3"><label className="form-label">Curso *</label>
                <select className="form-select" value={form.idCurso} onChange={e => setForm({ ...form, idCurso: e.target.value })}>
                  <option value="">Selecione...</option>
                  {cursos?.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                </select></div>
              <div className="mb-3"><label className="form-label">Data</label>
                <input type="date" className="form-control" value={form.dataMatricula} onChange={e => setForm({ ...form, dataMatricula: e.target.value })} /></div>
              <button type="submit" className="btn btn-primary w-100">Matricular</button>
            </form>
          </FormCard>
        </div>
        <div className="col-lg-8">
          <DataCard title="Matrículas Registradas" Icon={TableProperties}>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead><tr><th>Aluno</th><th>Curso</th><th>Data</th><th>Progresso</th><th>Conclusão</th></tr></thead>
                <tbody>
                  {matriculas?.map(m => {
                    const pct = progressos[m.id] ?? 0;
                    return (
                      <tr key={m.id}>
                        <td className="fw-medium">{findById(usuarios, m.idUsuario)?.nomeCompleto}</td>
                        <td style={{ color: '#64748b' }}>{findById(cursos, m.idCurso)?.titulo}</td>
                        <td style={{ color: '#94a3b8' }}>{formatDate(m.dataMatricula)}</td>
                        <td style={{ minWidth: 130 }}>
                          <div className="progress progress-lg mb-1">
                            <div className="progress-bar" style={{ width: `${pct}%` }} />
                          </div>
                          <small style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{pct}%</small>
                        </td>
                        <td style={{ color: '#94a3b8' }}>{m.dataConclusao ? formatDate(m.dataConclusao) : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DataCard>
        </div>
      </div>
    </section>
  );
}
