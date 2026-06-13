import { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { useData } from '../hooks/useData.js';
import { Validators, formatDate } from '../utils/validators.js';
import { createUsuario } from '../services/platformService.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import FormCard from '../components/ui/FormCard.jsx';
import DataCard from '../components/ui/DataCard.jsx';
import ErrorAlert from '../components/ui/ErrorAlert.jsx';

export default function UsuariosPage() {
  const { usuarios, refresh, showToast } = useData();
  const [form, setForm] = useState({ nomeCompleto: '', email: '', senha: '' });
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { nomeCompleto: form.nomeCompleto.trim(), email: form.email.trim(), senhaHash: 'hash_' + btoa(form.senha), dataCadastro: new Date().toISOString().split('T')[0] };
    const errs = Validators.validateFields([
      { value: data.nomeCompleto, label: 'Nome', rules: ['required'] },
      { value: data.email, label: 'E-mail', rules: ['required', 'email'] },
      { value: form.senha, label: 'Senha', rules: ['required'] }
    ]);
    if (usuarios.some(u => u.email.toLowerCase() === data.email.toLowerCase())) errs.push('E-mail já cadastrado.');
    setErrors(errs);
    if (errs.length) return;
    try {
      await createUsuario(data);
      setForm({ nomeCompleto: '', email: '', senha: '' });
      await refresh();
      showToast('Usuário cadastrado!');
    } catch (err) { setErrors([err.message]); }
  };

  return (
    <section>
      <PageHeader title="Usuários" subtitle="Cadastro de alunos e instrutores" />
      <div className="row g-4">
        <div className="col-lg-4">
          <FormCard title="Novo Usuário" Icon={UserPlus}>
            <ErrorAlert errors={errors} />
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nome Completo *</label>
                <input className="form-control form-control-lg" value={form.nomeCompleto} onChange={e => setForm({ ...form, nomeCompleto: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">E-mail *</label>
                <input type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Senha *</label>
                <input type="password" className="form-control" minLength={4} value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary w-100">Cadastrar</button>
            </form>
          </FormCard>
        </div>
        <div className="col-lg-8">
          <DataCard title="Usuários Cadastrados" Icon={Users}>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead><tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Cadastro</th></tr></thead>
                <tbody>
                  {usuarios?.map(u => (
                    <tr key={u.id}>
                      <td><span className="avatar-badge">{u.nomeCompleto.charAt(0)}</span></td>
                      <td className="fw-medium">{u.nomeCompleto}</td>
                      <td style={{ color: '#64748b' }}>{u.email}</td>
                      <td style={{ color: '#94a3b8' }}>{formatDate(u.dataCadastro)}</td>
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
