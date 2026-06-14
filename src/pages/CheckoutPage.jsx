import { useState } from 'react';
import { CreditCard, Receipt, Banknote, Lock, CheckCircle2 } from 'lucide-react';
import { useData, findById } from '../hooks/useData.js';
import { Validators, formatCurrency, formatDate } from '../utils/validators.js';
import { processarCheckout } from '../services/platformService.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import FormCard from '../components/ui/FormCard.jsx';
import DataCard from '../components/ui/DataCard.jsx';
import ErrorAlert from '../components/ui/ErrorAlert.jsx';

export default function CheckoutPage() {
  const { usuarios, planos, assinaturas, pagamentos, refresh, showToast } = useData();
  const [form, setForm] = useState({ idUsuario: '', idPlano: '', metodoPagamento: '' });
  const [errors, setErrors] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = Validators.validateFields([
      { value: form.idUsuario, label: 'Usuário', rules: ['required'] },
      { value: form.idPlano, label: 'Plano', rules: ['required'] },
      { value: form.metodoPagamento, label: 'Método', rules: ['required'] }
    ]);
    setErrors(errs);
    if (errs.length) return;

    setLoading(true);
    try {
      const result = await processarCheckout(Number(form.idUsuario), Number(form.idPlano), form.metodoPagamento);
      setResultado(result);
      setForm({ idUsuario: '', idPlano: '', metodoPagamento: '' });
      await refresh();
      showToast('Pagamento aprovado!');
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <PageHeader title="Checkout" subtitle="Simule pagamentos e assinaturas" />
      <div className="row g-4">
        <div className="col-lg-5">
          <FormCard title="Simular Pagamento" Icon={CreditCard}>
            <ErrorAlert errors={errors} />
            <form onSubmit={handleSubmit}>
              <div className="mb-3"><label className="form-label">Usuário *</label>
                <select className="form-select" value={form.idUsuario} onChange={e => setForm({ ...form, idUsuario: e.target.value })}>
                  <option value="">Selecione...</option>
                  {usuarios?.map(u => <option key={u.id} value={u.id}>{u.nomeCompleto}</option>)}
                </select></div>
              <div className="mb-3"><label className="form-label">Plano *</label>
                <select className="form-select" value={form.idPlano} onChange={e => setForm({ ...form, idPlano: e.target.value })}>
                  <option value="">Selecione...</option>
                  {planos?.map(p => <option key={p.id} value={p.id}>{p.nome} — {formatCurrency(p.preco)}</option>)}
                </select></div>
              <div className="mb-3"><label className="form-label">Método *</label>
                <select className="form-select" value={form.metodoPagamento} onChange={e => setForm({ ...form, metodoPagamento: e.target.value })}>
                  <option value="">Selecione...</option>
                  <option>Cartão de Crédito</option><option>Cartão de Débito</option><option>PIX</option><option>Boleto</option>
                </select></div>
              <button
                type="submit"
                className="btn btn-success w-100 btn-lg d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                <Lock size={16} />
                {loading ? 'Processando...' : 'Pagar Agora'}
              </button>
            </form>

            {resultado && (
              <div style={{
                marginTop: 20, padding: '16px 18px',
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: 10
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#166534', marginBottom: 10 }}>
                  <CheckCircle2 size={17} />
                  Pagamento aprovado!
                </div>
                <div style={{ fontSize: '0.875rem', color: '#166534', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span><strong>Plano:</strong> {resultado.plano.nome}</span>
                  <span><strong>Valor:</strong> {formatCurrency(resultado.pagamento.valorPago)}</span>
                  <span><strong>Transação:</strong> <code style={{ fontSize: '0.78rem' }}>{resultado.pagamento.idTransacaoGateway}</code></span>
                  <span><strong>Vigência:</strong> {formatDate(resultado.assinatura.dataInicio)} — {formatDate(resultado.assinatura.dataFim)}</span>
                </div>
              </div>
            )}
          </FormCard>
        </div>
        <div className="col-lg-7">
          <DataCard title="Assinaturas" Icon={Receipt}>
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead><tr><th>Usuário</th><th>Plano</th><th>Início</th><th>Fim</th></tr></thead>
                <tbody>
                  {assinaturas?.map(a => (
                    <tr key={a.id}>
                      <td className="fw-medium">{findById(usuarios, a.idUsuario)?.nomeCompleto}</td>
                      <td style={{ color: '#64748b' }}>{findById(planos, a.idPlano)?.nome}</td>
                      <td style={{ color: '#94a3b8' }}>{formatDate(a.dataInicio)}</td>
                      <td style={{ color: '#94a3b8' }}>{formatDate(a.dataFim)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataCard>
          <div className="mt-3">
            <DataCard title="Pagamentos" Icon={Banknote}>
              <div className="table-responsive">
                <table className="table table-sm table-hover">
                  <thead><tr><th>Valor</th><th>Data</th><th>Método</th><th>Transação</th></tr></thead>
                  <tbody>
                    {pagamentos?.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 700, color: '#4f46e5' }}>{formatCurrency(p.valorPago)}</td>
                        <td style={{ color: '#94a3b8' }}>{formatDate(p.dataPagamento)}</td>
                        <td style={{ color: '#64748b' }}>{p.metodoPagamento}</td>
                        <td><code style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.idTransacaoGateway}</code></td>
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
