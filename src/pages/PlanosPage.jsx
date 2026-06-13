import { useState } from 'react';
import { PlusCircle, Table, Check } from 'lucide-react';
import { useData } from '../hooks/useData.js';
import { Validators, formatCurrency } from '../utils/validators.js';
import { createPlano } from '../services/platformService.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import FormCard from '../components/ui/FormCard.jsx';
import DataCard from '../components/ui/DataCard.jsx';
import ErrorAlert from '../components/ui/ErrorAlert.jsx';

export default function PlanosPage() {
  const { planos, refresh, showToast } = useData();
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', duracaoMeses: '' });
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { nome: form.nome.trim(), descricao: form.descricao.trim(), preco: Number(form.preco), duracaoMeses: Number(form.duracaoMeses) };
    const errs = Validators.validateFields([
      { value: data.nome, label: 'Nome', rules: ['required'] },
      { value: data.descricao, label: 'Descrição', rules: ['required'] },
      { value: data.preco, label: 'Preço', rules: ['required', 'positive'] },
      { value: data.duracaoMeses, label: 'Duração', rules: ['required', 'positive'] }
    ]);
    setErrors(errs);
    if (errs.length) return;
    try {
      await createPlano(data);
      setForm({ nome: '', descricao: '', preco: '', duracaoMeses: '' });
      await refresh();
      showToast('Plano cadastrado!');
    } catch (err) { setErrors([err.message]); }
  };

  return (
    <section>
      <PageHeader title="Planos" subtitle="Gerencie planos de assinatura" />

      <div className="row g-3 mb-4">
        {planos?.map(p => {
          const featured = p.nome === 'Premium';
          return (
            <div key={p.id} className="col-md-4">
              <div className={`card plano-card h-100 ${featured ? 'plano-featured' : ''}`}>
                {featured && (
                  <div style={{
                    position: 'absolute', top: -1, right: 20,
                    background: '#4f46e5', color: '#fff',
                    fontSize: '0.7rem', fontWeight: 700,
                    padding: '3px 12px', borderRadius: '0 0 8px 8px',
                    letterSpacing: '0.05em', textTransform: 'uppercase'
                  }}>Popular</div>
                )}
                <div className="card-body text-center p-4">
                  <h5 style={{ fontWeight: 700, marginBottom: 4 }}>{p.nome}</h5>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 16 }}>{p.descricao}</p>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: '#4f46e5', letterSpacing: '-0.04em' }}>
                      {formatCurrency(p.preco)}
                    </span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: 20 }}>por {p.duracaoMeses} mês(es)</p>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 6, fontSize: '0.8rem', color: '#059669', fontWeight: 500
                  }}>
                    <Check size={14} />
                    Acesso completo
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <FormCard title="Novo Plano" Icon={PlusCircle}>
            <ErrorAlert errors={errors} />
            <form onSubmit={handleSubmit}>
              <div className="mb-3"><label className="form-label">Nome *</label>
                <input className="form-control" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
              <div className="mb-3"><label className="form-label">Descrição *</label>
                <textarea className="form-control" rows={2} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} /></div>
              <div className="mb-3"><label className="form-label">Preço (R$) *</label>
                <input type="number" step="0.01" min="0.01" className="form-control" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} /></div>
              <div className="mb-3"><label className="form-label">Duração (meses) *</label>
                <input type="number" min="1" className="form-control" value={form.duracaoMeses} onChange={e => setForm({ ...form, duracaoMeses: e.target.value })} /></div>
              <button type="submit" className="btn btn-primary w-100">Cadastrar Plano</button>
            </form>
          </FormCard>
        </div>
        <div className="col-lg-8">
          <DataCard title="Planos Cadastrados" Icon={Table}>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead><tr><th>ID</th><th>Nome</th><th>Preço</th><th>Duração</th></tr></thead>
                <tbody>
                  {planos?.map(p => (
                    <tr key={p.id}>
                      <td style={{ color: '#94a3b8' }}>#{p.id}</td>
                      <td className="fw-medium">{p.nome}</td>
                      <td style={{ color: '#4f46e5', fontWeight: 600 }}>{formatCurrency(p.preco)}</td>
                      <td style={{ color: '#64748b' }}>{p.duracaoMeses} mês(es)</td>
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
